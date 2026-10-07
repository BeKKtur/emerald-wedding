import React, {useEffect, useId, useRef, useState} from 'react';
import {wedding} from '../../config/wedding';
import {Invitation} from '../shared';

// One clock, five states, no CSS animation timers.
const schedule = {sealEnd: 500, flapStart: 600, flapEnd: 1800, pullStart: 2300, pullEnd: 4000, fadeStart: 4700, end: 5700};
const clamp = value => Math.max(0, Math.min(1, value));
const progress = (time, start, end) => clamp((time - start) / (end - start));
function bezier(x1, y1, x2, y2) {
  const curve = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  return value => {
    if (value <= 0 || value >= 1) return clamp(value);
    let low = 0, high = 1;
    for (let i = 0; i < 18; i++) {
      const middle = (low + high) / 2;
      if (curve(middle, x1, x2) < value) low = middle; else high = middle;
    }
    return curve((low + high) / 2, y1, y2);
  };
}
const ease = {
  seal: bezier(.25, .1, .25, 1),
  flap: bezier(.45, 0, .55, 1),
  letter: bezier(.28, .12, .22, 1),
  fade: bezier(.22, .68, .25, 1),
};
const flapOutline = 'M0 0 L620 0 C548 115 419 173 327 228 Q310 240 293 228 C201 173 72 115 0 0Z';
const frontOutline = 'M0 0 C105 112 232 181 294 220 Q310 231 326 220 C388 181 515 112 620 0 L620 400 L0 400Z';

function PaperSurface({id, outline, height, reverse = false, seams = false, lighting = false}) {
  return <svg viewBox={`0 0 620 ${height}`} preserveAspectRatio="none" className={reverse ? 'paper-reverse' : 'paper-face'} aria-hidden="true">
    <defs><pattern id={id} width="620" height={height} patternUnits="userSpaceOnUse">
      <image href={wedding.images.paper} width="620" height={height} preserveAspectRatio="xMidYMid slice" />
    </pattern></defs>
    <path d={outline} fill={`url(#${id})`} />
    {reverse && <path d={outline} fill="#b49a7026" />}
    {lighting && <path data-flap-light d={outline} fill="#292617" opacity="0" />}
    <path d={outline} fill="none" stroke="#ba9458" strokeWidth="1.3" />
    {seams && <path d="M1 399 Q175 232 310 224 Q445 232 619 399" fill="none" stroke="#ba9458" strokeWidth="1.3" />}
  </svg>;
}

export default function Envelope({onTransition, onComplete}) {
  const id = useId().replace(/:/g, '_');
  const [state, setState] = useState('closed');
  const root = useRef(null);
  const envelope = useRef(null);
  const letter = useRef(null);
  const flap = useRef(null);
  const seal = useRef(null);
  const hint = useRef(null);
  const frame = useRef(0);
  const started = useRef(false);
  const currentState = useRef('closed');
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function open() {
    if (started.current) return;
    started.current = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lighting = flap.current.querySelectorAll('[data-flap-light]');
    let start;
    let transitioned = false;
    function changeState(next) {
      if (currentState.current !== next) {
        currentState.current = next;
        root.current.dataset.state = next;
        setState(next);
      }
    }
    function tick(now) {
      if (!root.current) return;
      start ??= now;
      const elapsed = now - start;
      if (reduced) {
        changeState('finished');
        if (!transitioned) { transitioned = true; onTransition(); }
        root.current.style.opacity = String(1 - progress(elapsed, 0, 600));
        if (elapsed >= 600) { onComplete(); return; }
      } else {
        changeState(elapsed < schedule.flapEnd ? 'opening' : elapsed < schedule.pullStart ? 'revealed' : elapsed < schedule.pullEnd ? 'pulling' : 'finished');
        const wax = ease.seal(progress(elapsed, 0, schedule.sealEnd));
        seal.current.style.opacity = String(1 - wax);
        seal.current.style.transform = `translate(-50%, -50%) translateZ(3px) scale(${1 - .06 * wax})`;
        // Flap ONLY rotates. Its top, origin and translation never change.
        const angle = 158 * ease.flap(progress(elapsed, schedule.flapStart, schedule.flapEnd));
        const rotation = `rotateX(${-angle}deg)`;
        flap.current.style.transform = rotation;
        flap.current.style.webkitTransform = rotation;
        // A little changing light on the paper face makes the depth readable
        // without scaling or filtering the hinged 3D container. At rest it is zero.
        const shade = .14 * Math.sin(Math.PI * angle / 158);
        lighting.forEach(surface => surface.style.opacity = String(shade));
        // The sheet is stationary and opaque. Reveal it progressively from
        // half of the actual flap rotation, never over the closed flap.
        const aperture = clamp((angle - 158 * .5) / (158 * .5));
        const visible = aperture * aperture * (3 - 2 * aperture);
        const clip = `inset(0 0 ${100 * (1 - visible)}% 0)`;
        letter.current.style.clipPath = clip;
        letter.current.style.webkitClipPath = clip;
        const pull = 65 * ease.letter(progress(elapsed, schedule.pullStart, schedule.pullEnd));
        letter.current.style.transform = `translateY(${-pull}%) translateZ(1px)`;
        hint.current.style.opacity = String(1 - progress(elapsed, 0, 300));
        if (elapsed >= schedule.fadeStart && !transitioned) { transitioned = true; onTransition(); }
        const fade = ease.fade(progress(elapsed, schedule.fadeStart, schedule.end));
        root.current.style.opacity = String(1 - fade);
        root.current.style.filter = fade ? `blur(${fade * 5}px)` : 'none';
        if (elapsed >= schedule.end) { onComplete(); return; }
      }
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
  }

  return <div ref={root} className="envelope-scene" data-state={state} style={{'--envelope-paper': `url(${wedding.images.paper})`, '--envelope-velvet': `url(${wedding.images.velvet})`}}>
    <div ref={envelope} className="envelope" onClick={open}>
      <div className="envelope-back" />
      <div ref={letter} className="letter"><Invitation /></div>
      <div ref={flap} className="flap">
        <PaperSurface id={`${id}-flap`} outline={flapOutline} height={236} lighting />
        <PaperSurface id={`${id}-reverse`} outline={flapOutline} height={236} reverse lighting />
      </div>
      <div className="envelope-front"><PaperSurface id={`${id}-front`} outline={frontOutline} height={400} seams /></div>
      <button ref={seal} className="wax-seal" onClick={open} disabled={state !== 'closed'} aria-label={wedding.labels.open}>
        <span>{wedding.bride[0]}<small>&</small>{wedding.groom[0]}</span><i aria-hidden="true">❧</i>
      </button>
    </div>
    <p ref={hint} className="envelope-hint">{wedding.labels.open}<span aria-hidden="true">◇</span></p>
  </div>;
}

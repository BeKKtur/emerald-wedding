import React, {useEffect, useId, useRef, useState} from 'react';
import {wedding} from '../../config/wedding';
import {Invitation} from '../shared';

export const OPEN_DURATION = 4900;
export const TRANSITION_START = 3650;

// Draw paper directly in SVG: no CSS mask on a rotating Safari compositor layer.
function MobileFlap() {
  const id = useId().replace(/:/g, '_');
  const outline = 'M0 0 L620 0 C548 115 419 173 327 228 Q310 240 293 228 C201 173 72 115 0 0Z';
  return <div className="envelope-flap-mobile" aria-hidden="true">
    {['front', 'back'].map(face => <div className={`mobile-flap-face mobile-flap-${face}`} key={face}>
      <svg viewBox="0 0 620 236" preserveAspectRatio="none">
        <defs><pattern id={`${id}-${face}`} width="620" height="236" patternUnits="userSpaceOnUse">
          <image href={wedding.images.paper} width="620" height="236" preserveAspectRatio="xMidYMid slice" />
        </pattern></defs>
        <path d={outline} fill={`url(#${id}-${face})`} />
        <path d={outline} fill={face === 'back' ? '#b49a7030' : '#fff4'} />
        <path d={outline} fill="none" stroke="#b78b49" strokeWidth="1.5" />
      </svg>
    </div>)}
  </div>;
}

export default function Envelope({onTransition, onComplete}) {
  const [opened, setOpened] = useState(false);
  const started = useRef(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function open() {
    if (started.current) return;
    started.current = true;
    setOpened(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current = [
      setTimeout(onTransition, reduced ? 40 : TRANSITION_START),
      setTimeout(onComplete, reduced ? 650 : OPEN_DURATION),
    ];
  }
  return <div className={`intro ${opened ? 'is-opening' : ''}`} style={{
    '--velvet': `url(${wedding.images.velvet})`,
    '--paper': `url(${wedding.images.paper})`,
    '--botanical': `url(${wedding.images.botanical})`,
  }}>
    <div className="intro-shade" />
    <div className="envelope-stage">
      <div className="envelope-assembly">
        <div className="envelope-back" />
        <div className="letter"><Invitation /></div>
        <div className="envelope-pocket" aria-hidden="true">
          <svg className="envelope-seams" viewBox="0 0 620 400" preserveAspectRatio="none">
            <path d="M1 4 Q105 116 310 224 Q515 116 619 4 M1 399 Q175 232 310 224 Q445 232 619 399" />
          </svg>
        </div>
        <div className="envelope-flap" aria-hidden="true"><div className="flap-front"><svg className="flap-edge" viewBox="0 0 620 236" preserveAspectRatio="none"><path d="M1 1 C72 115 201 173 293 228 Q310 240 327 228 C419 173 548 115 619 1" /></svg></div><div className="flap-back" /></div>
        <MobileFlap />
        <button className="seal" onClick={open} disabled={opened} aria-label={wedding.labels.open}>
          <span>{wedding.bride[0]}<small>&</small>{wedding.groom[0]}</span><i aria-hidden="true">❧</i>
        </button>
      </div>
    </div>
    <p className="intro-prompt" aria-live="polite">{opened ? 'Приглашение для вас' : wedding.labels.open}<span aria-hidden="true">{opened ? '' : '◇'}</span></p>
  </div>;
}

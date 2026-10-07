import {useCallback, useEffect, useRef, useState} from 'react';
import {duration, stationeryPose} from './stationery';

export function useStationeryMotion(draw, onEnter, onDone) {
  const [phase, setPhase] = useState('sealed');
  const running = useRef(false);
  const raf = useRef(0);
  const handlers = useRef({draw, onEnter, onDone});
  handlers.current = {draw, onEnter, onDone};
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let epoch;
    let entered = false;
    let previous = 'sealed';
    function render(now) {
      epoch ??= now;
      const elapsed = now - epoch;
      const pose = reduced
        ? {...stationeryPose(0), phase: 'crossing', sceneOpacity: 1 - Math.min(1, elapsed / 600), enterSite: true, complete: elapsed >= 600}
        : stationeryPose(elapsed);
      handlers.current.draw(pose);
      if (pose.phase !== previous) { previous = pose.phase; setPhase(pose.phase); }
      if (pose.enterSite && !entered) { entered = true; handlers.current.onEnter(); }
      if (pose.complete || (!reduced && elapsed >= duration)) { handlers.current.onDone(); return; }
      raf.current = requestAnimationFrame(render);
    }
    raf.current = requestAnimationFrame(render);
  }, []);
  return {phase, start};
}

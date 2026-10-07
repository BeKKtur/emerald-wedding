// Native SVG geometry. One coordinate system scales every piece together.
export const paper = Object.freeze({width: 640, height: 400, mouth: 214, cardX: 40, cardY: 18, cardWidth: 560, cardHeight: 350, overlap: 18});
export const duration = 4900;
const unit = value => Math.max(0, Math.min(1, value));
const between = (time, start, end) => unit((time - start) / (end - start));
// Cubic easing with zero velocity at both ends (Bezier 1/3,0,2/3,1).
const soft = value => value * value * (3 - 2 * value);

export function stationeryPose(time) {
  const turn = soft(between(time, 520, 1620));
  const angle = 164 * turn;
  const extraction = soft(between(time, 2120, 3420));
  const travel = paper.cardY + paper.cardHeight - paper.mouth - paper.overlap;
  return {
    phase: time < 450 ? 'unsealing' : time < 1620 ? 'unfolding' : time < 2120 ? 'resting' : time < 3420 ? 'extracting' : time < 3850 ? 'reading' : 'crossing',
    sealOpacity: 1 - soft(between(time, 0, 450)),
    sealScale: 1 - .07 * soft(between(time, 0, 450)),
    angle,
    cardOpacity: soft(unit((angle - 100) / 45)),
    cardY: paper.cardY - travel * extraction,
    rimOpacity: soft(unit((angle - 100) / 45)),
    sceneOpacity: 1 - soft(between(time, 3850, duration)),
    hintOpacity: 1 - soft(between(time, 0, 250)),
    enterSite: time >= 3850,
    complete: time >= duration,
  };
}

function quadratic(start, control, end, segments) {
  return Array.from({length: segments}, (_, index) => {
    const t = (index + 1) / segments;
    return [
      (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t ** 2 * end[0],
      (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t ** 2 * end[1],
    ];
  });
}
const flapPerimeter = [
  [0, 0], [640, 0],
  ...quadratic([640, 0], [555, 138], [337, 233], 32),
  ...quadratic([337, 233], [320, 249], [303, 233], 12),
  ...quadratic([303, 233], [85, 138], [0, 0], 32),
];

export function projectedFlap(angle) {
  const radians = angle * Math.PI / 180;
  const distance = 1100;
  const points = flapPerimeter.map(([x, y]) => {
    // rotateX around y=0, then perspective projection. Every point on the
    // hinge has y=z=0, so its screen coordinates can NEVER move away.
    const depth = y * Math.sin(radians);
    const perspective = distance / (distance + depth);
    return [320 + (x - 320) * perspective, y * Math.cos(radians) * perspective];
  });
  return points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join(' ') + ' Z';
}

export function invitationLines(copy) {
  const lines = [''];
  for (const word of copy.trim().split(/\s+/)) {
    const last = lines.length - 1;
    const next = lines[last] ? `${lines[last]} ${word}` : word;
    if (next.length > 38 && lines[last]) lines.push(word); else lines[last] = next;
  }
  return lines;
}

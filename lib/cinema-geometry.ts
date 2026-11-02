/** Scale a contained video to cover its stage; unmeasured layouts stay finite. */
export function cinemaCoverScale(stageWidth: number, stageHeight: number, frameWidth: number, frameHeight: number, ratio: number): number {
  if (![stageWidth, stageHeight, frameWidth, frameHeight, ratio].every(value => Number.isFinite(value) && value > 0)) return 1;
  const width = Math.min(frameWidth, frameHeight * ratio);
  const scale = Math.max(stageWidth / width, stageHeight / (width / ratio));
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

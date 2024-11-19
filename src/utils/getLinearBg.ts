export const getLinearBg = (color: string, progress: number) => {
  return `linear-gradient(to right, ${color} ${progress}%, rgba(255,255,255,.15) ${progress}%, rgba(255,255,255,.15) 100%)`;
};

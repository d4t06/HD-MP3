export const getLinearBg = (
  progress: number,
  props?: { color?: string; baseColor?: string },
) => {
  const { color = "var(--primary-cl)", baseColor = "var(--a-5-cl)" } =
    props || {};

  return `linear-gradient(to right, ${color} ${progress}%, ${baseColor} ${progress}%, ${baseColor}`;
};

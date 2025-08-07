export const getLinearBg = (
  progress: number,
  props?: { color?: string; baseColor?: string },
) => {
  const { color = "var(--primary-cl)", baseColor = "var(--a-10-cl)" } =
    props || {};

  return `linear-gradient(to right, ${color} ${progress}%, ${baseColor} ${progress}%, ${baseColor}`;
};

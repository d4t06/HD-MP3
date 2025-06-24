import { nanoid } from "nanoid";

export default function createKeyFrame(
  growList: number[],
  widthList: number[],
) {
  const name = `lyric_${nanoid(4)}`;

  const style = document.querySelector(
    "style.keyframe",
  ) as HTMLStyleElement | null;
  if (!style) return name;

  let keyFrame = `@keyframes ${name}{0%{width:0%}`;

  if (!growList.length) {
    keyFrame += "100%{width:100%}}";
    style.innerText = keyFrame;

    return name;
  }

  let totalGrow = growList.reduce((p, c) => p + c, 0);

  const keyFrameData: { progress: number; width: number }[] = [];

  let sumGrow = 0;
  let sumWidth = 0;
  for (let index = 0; index < widthList.length - 1; index++) {
    const textWidth = widthList[index];
    const textGrow = growList[index];

    sumWidth += textWidth;
    sumGrow += textGrow;

    keyFrameData.push({
      progress: Math.round((sumGrow / totalGrow) * 100),
      width: sumWidth,
    });
  }

  for (const data of keyFrameData) {
    keyFrame += `${data.progress}%{width:${data.width}%}`;
  }

  keyFrame += "100%{width:100%}}";

  style.innerText = keyFrame;

  return name;
}

export default function createKeyFrame(growList: number[]) {
  const style = document.querySelector("style");

  if (!style) return;

  let keyFrame = `@keyframes lyric{0%{width:0%}100%{width:100%}`;

//   let minimalAmount = 100 / growList.length;
//   let totalGrow = growList.reduce((p, c) => p + c, 0);

//   const keyFrameData: { progress: number; width: number }[] = [];

//   let sumGrow = 0;
//   for (let index = 0; index < growList.length - 1; index++) {
//     const grow = growList[index];

//     keyFrameData.push({
//       progress: Math.round((sumGrow / totalGrow) * 100),
//       width: Math.round(minimalAmount * (index + 1)),
//     });

//     sumGrow += grow;
//   }

//   for (const data of keyFrameData) {
//     keyFrame += `${data.progress}%{width:${data.width}%}`;
//   }

//   keyFrame += "100%{width:100%}}";
//   console.log(keyFrame);

  style.innerText = keyFrame;
}

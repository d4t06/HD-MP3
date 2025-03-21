export const getWordsRatio = (containerEle: HTMLDivElement) => {
  const totalWith = containerEle.clientWidth;

  const list: number[] = [];
  containerEle.childNodes.forEach((child) => {
    list.push(Math.round(((child as HTMLSpanElement).clientWidth / totalWith) * 100));
  });

  return list;
};

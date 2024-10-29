import { ElementRef, useEffect, useRef } from "react";

type Props = {
  isOpenFullScreen: boolean;
};
export default function useMobileFullScreenPlayer({ isOpenFullScreen }: Props) {
  const wrapperRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    const wrapperEle = wrapperRef.current;
    if (!wrapperEle) return;

    if (isOpenFullScreen) {
      wrapperEle.style.transform = "translate(0)";
      wrapperEle.style.zIndex = "99";
    } else {
      wrapperEle.style.transform = "translate(0, 100%)";
      setTimeout(() => {
        wrapperEle.style.zIndex = "-10";
      }, 500);
    }
  }, [isOpenFullScreen]);

  return { wrapperRef };
}

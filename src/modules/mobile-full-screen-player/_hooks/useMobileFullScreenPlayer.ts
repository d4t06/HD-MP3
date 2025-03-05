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

  const handleOverflow = () => {
    const body = document.querySelector("body");
    if (body) {
      if (isOpenFullScreen) body.style.overflow = "hidden";
      else body.style.overflow = "auto";
    }
  };
  useEffect(() => {
    handleOverflow();
  }, [isOpenFullScreen]);

  return { wrapperRef };
}

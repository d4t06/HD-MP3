import { scrollIntoView } from "@/utils/appHelpers";
import {
  ElementRef,
  MutableRefObject,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { LyricStatus } from "../LyricEditor";

type Props = {
  text: string;
  status: LyricStatus;
  className?: string;
  activeColor?: string;
  scrollBehavior?: MutableRefObject<ScrollBehavior>;
};

function LyricItem(
  { text, className = "", status, scrollBehavior, activeColor }: Props,
  ref: Ref<HTMLParagraphElement>
) {
  const lyricRef = useRef<ElementRef<"p">>(null);

  useImperativeHandle(ref, () => lyricRef.current!, []);

  const scroll = () => {
    const ele = lyricRef.current as HTMLElement;
    if (ele) {
      scrollIntoView(ele, scrollBehavior?.current || "smooth");
      if (scrollBehavior?.current === "instant") scrollBehavior.current = "smooth";
    }
  };

  const getClass = () => {
    switch (status) {
      case "coming":
        return "";
      case "active":
        return `${activeColor || "text-[#ffed00]"} active-lyric`;
      case "done":
        return "disable";
    }
  };

  useEffect(() => {
    if (status === "active") {
      scroll();
    }
  }, [status]);

  return (
    <p ref={lyricRef} className={`${className} select-none  font-[700] ${getClass()}`}>
      {text}
    </p>
  );
}

export default forwardRef(LyricItem);

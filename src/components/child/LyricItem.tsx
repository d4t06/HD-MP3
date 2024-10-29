import { scrollIntoView } from "@/utils/appHelpers";
import { MutableRefObject, useEffect, useRef } from "react";
import { LyricStatus } from "../LyricEditor";

type Props = {
  text: string;
  status: LyricStatus;
  className?: string;
  activeColor?: string;
  scrollBehavior?: MutableRefObject<ScrollBehavior>;
};

export default function LyricItem({
  text,
  className = "",
  status,
  scrollBehavior,
  activeColor,
}: Props) {
  const lyricRef = useRef<HTMLParagraphElement>(null);

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
        return `${activeColor || 'text-[#ffed00]'} active-lyric`;
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

import { scrollIntoView } from "@/utils/appHelpers";
import { MutableRefObject, useEffect, useRef } from "react";
import { LyricStatus } from "../LyricEditor";

type Props = {
  text: string;
  status: LyricStatus;
  className?: string;
  scrollBehavior?: MutableRefObject<ScrollBehavior>;
};

export default function LyricItem({
  text,
  className = "",
  status,
  scrollBehavior,
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
        return "text-[#ffed00] active-lyric";
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
    <p
      ref={lyricRef}
      className={`${className} select-none text-left font-[500] ${getClass()}`}
    >
      {text}
    </p>
  );
}

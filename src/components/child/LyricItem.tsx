import { LyricStatus } from "@/modules/lyric-editor";
import { Ref, forwardRef, useEffect } from "react";

type Props = {
  text: string;
  status: LyricStatus;
  className?: string;
  activeColor?: string;
};

function LyricItem(
  { text, className = "", status, activeColor }: Props,
  ref: Ref<HTMLParagraphElement>
) {
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
    <p ref={ref} className={`${className} select-none  font-[700] ${getClass()}`}>
      {text}
    </p>
  );
}

export default forwardRef(LyricItem);

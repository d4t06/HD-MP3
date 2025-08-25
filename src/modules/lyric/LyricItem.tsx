import { LyricStatus } from "@/modules/lyric-editor";
import { Ref, forwardRef } from "react";

type Props = {
  text: string;
  status: LyricStatus;
  className?: string;
  activeColor?: string;
};

function LyricItem(
  { text, className = "", status, activeColor }: Props,
  ref: Ref<HTMLParagraphElement>,
) {
  const getClass = () => {
    switch (status) {
      case "coming":
        return "";
      case "active":
        return `${activeColor || "text-[#ffed00]"} active-lyric`;
      case "done":
        return "";
    }
  };

  // useEffect(() => {
  //   if (status === "active") {
  //     scroll();
  //   }
  // }, [status]);

  return (
    <p ref={ref} className={`${className} ${getClass()}`}>
      {text}
    </p>
  );
}

export default forwardRef(LyricItem);


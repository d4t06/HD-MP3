import { useEffect, useState, RefObject } from "react";
import { Button } from ".";
import { ArrowSmallUpIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../store";

function ScrollTop({ containerRef, className }: { containerRef?: RefObject<HTMLDivElement>, className?: string }) {
  const [isShow, setIsShow] = useState(false);
  const { theme } = useTheme();

  const handleScroll = () => {
    const containerEle = document.querySelector(".main-container")
    if (!containerEle) return;
    const scrollTop = containerEle.scrollTop || 0;
    setIsShow(scrollTop > 100);
  };

  const scrollToTop = () => {
    const mainContainer = document.querySelector(".main-container");
    mainContainer?.scroll({
      behavior: "smooth",
      top: 0,
    });
  };

  useEffect(() => {

    const containerEle = document.querySelector(".main-container")
    if (!containerEle) return;

    containerEle.addEventListener("scroll", handleScroll);

    return () => {
      containerEle.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Button
      onClick={scrollToTop}
      variant={"circle"}
      className={`absolute transition-[opacity,transform] ${className || ''} w-[30px] ${
        theme.content_hover_bg
      } h-[30px] bg-${theme.alpha} 
      ${isShow ? "opacity-[1]" : "opacity-0 translate-y-[20px]"}`}
    >
      <ArrowSmallUpIcon className="w-[20px]" />
    </Button>
  );
}

export default ScrollTop;

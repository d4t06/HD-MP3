import { useEffect, useState, RefObject } from "react";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components";

function ScrollTop({
  className,
}: {
  containerRef?: RefObject<HTMLDivElement>;
  className?: string;
}) {
  const [isShow, setIsShow] = useState(false);

  const handleScroll = () => {
    const containerEle = document.querySelector(".main-container");
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
    const containerEle = document.querySelector(".main-container");
    if (!containerEle) return;

    containerEle.addEventListener("scroll", handleScroll);

    return () => {
      containerEle.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Button
      onClick={scrollToTop}
      size={"clear"}
      className={`absolute p-2 transition-[transform,opacity] 
         ${className || ""} 
         w-[36px] 
         hover:bg-[--a-5-cl]  
      ${isShow ? "opacity-[1]" : "opacity-0 translate-y-[20px]"}`}
    >
      <ArrowUpIcon className="w-6" />
    </Button>
  );
}

export default ScrollTop;

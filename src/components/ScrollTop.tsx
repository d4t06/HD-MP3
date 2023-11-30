import { useEffect, useState, RefObject } from "react";
import { Button } from ".";
import { ArrowSmallUpIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../store";

function ScrollTop({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const [isShow, setIsShow] = useState(false);
  const { theme } = useTheme();

  const handleScroll = () => {
    const scrollTop = containerRef.current?.scrollTop || 0;
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
    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Button
      onClick={scrollToTop}
      variant={"circle"}
      className={`fixed right-[5px] bottom-[80px] md:bottom-[100px] w-[30px] ${
        theme.content_hover_bg
      } h-[30px] bg-${theme.alpha} 
      ${isShow ? "" : "hidden"}`}
    >
      <ArrowSmallUpIcon className="w-[20px]" />
    </Button>
  );
}

export default ScrollTop;

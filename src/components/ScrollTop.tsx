import { useEffect, useState, RefObject } from "react";
import { Button } from ".";
import { useThemeContext } from "../stores";
import { ArrowUpIcon } from "@heroicons/react/20/solid";

function ScrollTop({
   className,
}: {
   containerRef?: RefObject<HTMLDivElement>;
   className?: string;
}) {
   const [isShow, setIsShow] = useState(false);
   const { theme } = useThemeContext();

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
         variant={"circle"}
         size={'clear'}
         className={`absolute p-[8px] hover:scale-[1.05] transition-[opacity,transform] 
         ${className || ""} 
         w-[36px] 
         ${theme.content_hover_bg} h-[36px] bg-${theme.alpha} 
      ${isShow ? "opacity-[1]" : "opacity-0 translate-y-[20px]"}`}
      >
         <ArrowUpIcon className="w-full" />
      </Button>
   );
}

export default ScrollTop;

import { MutableRefObject, useEffect, useRef } from "react";

interface Props {
   children: string;
   active: boolean;
   done: boolean;
   firstTimeRender: MutableRefObject<boolean>;
   scrollBehavior?: MutableRefObject<ScrollBehavior>;
   inUpload?: boolean;
   className?: string;
}

export default function LyricItem({
   children,
   active,
   done,
   firstTimeRender,
   inUpload,
   className,
   scrollBehavior,
}: Props) {
   const lyricRef = useRef<HTMLParagraphElement>(null);

   const handleScroll = () => {
      const node = lyricRef.current as HTMLElement;
      scroll(node);
   };

   const scroll = (ele: HTMLElement) => {
      // console.log("scroll");

      ele.scrollIntoView({
         behavior: scrollBehavior?.current || "smooth",
         block: "center",
      });
   };

   useEffect(() => {
      if (active) {
         if (firstTimeRender.current) {
            firstTimeRender.current = false;
            return;
         }

         handleScroll();

         if (scrollBehavior && scrollBehavior.current != "smooth") {
            scrollBehavior.current = "smooth";
         }
      }
   }, [active]);

   return (
      <p
         ref={lyricRef}
         className={`${className && className} ${inUpload ? "text-[16px]" : "text-[30px] min-[1536px]:text-[40px]"}  select-none  max-[549px]:text-center font-bold ${done && "opacity-40"} ${ inUpload ? "flex" : ""} ${active && !inUpload ? "text-[#ffed00]" : ""}`}
      >
         {children}
         {inUpload && active && <span className="ml-[10px] text-[16px]"></span>}
      </p>
   );
}

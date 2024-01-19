import { MutableRefObject, useEffect, useRef } from "react";

type Props = {
   inUpload?: boolean;
   children: string;
   active: boolean;
   done: boolean;
   className?: string;
   scrollBehavior: MutableRefObject<ScrollBehavior>;
};

export default function LyricItem({ children, active, done, inUpload, className, scrollBehavior }: Props) {
   const lyricRef = useRef<HTMLParagraphElement>(null);

   const scroll = () => {
      const ele = lyricRef.current as HTMLElement;

      if (ele) {
         ele.scrollIntoView({
            behavior: scrollBehavior.current,
            block: "center",
         });

         if (scrollBehavior.current === "instant") scrollBehavior.current = "smooth";
      }
   };

   useEffect(() => {
      if (active) {
         scroll();
      }
   }, [active]);

   return (
      <p
         ref={lyricRef}
         className={`lyric ${className && className} ${
            inUpload ? "text-[16px]" : "text-[30px] min-[1536px]:text-[40px]"
         }  select-none  max-[549px]:text-center font-bold ${done && "opacity-40"} ${inUpload ? "flex" : ""} ${
            active && !inUpload ? "text-[#ffed00]" : ""
         }`}
      >
         {children}
         {inUpload && active && <span className="ml-[10px] text-[16px]"></span>}
      </p>
   );
}

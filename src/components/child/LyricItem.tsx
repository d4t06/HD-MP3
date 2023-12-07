import { useEffect, useRef } from "react";

interface Props {
   children: string;
   active: boolean;
   done: boolean;
   inUpload?: boolean;
   className?: string;
}

export default function LyricItem({ children, active, done, inUpload, className }: Props) {
   const lyricRef = useRef<HTMLParagraphElement>(null);

   const scroll = () => {
      const ele = lyricRef.current as HTMLElement;
      if (ele) {
         ele.scrollIntoView({
            behavior: "smooth",
            block: "center",
         });
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

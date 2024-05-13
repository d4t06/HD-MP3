import { useRef } from "react";
import useScrollText from "../hooks/useScrollText";

type Props = {
   label: string;
   autoScroll?: boolean;
   classNames: string;
};

export default function ScrollText({ label, classNames, autoScroll }: Props) {
   const textWrapperRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);

   // use hooks
   useScrollText({ textRef, textWrapperRef, autoScroll });

   return (
      <div ref={textWrapperRef} className="overflow-hidden scroll-smooth relative h-full">
         <div
            ref={textRef}
            className={`${classNames} absolute left-0 whitespace-nowrap line-clamp-1`}
         >
            {label || "..."}
         </div>
      </div>
   );
}

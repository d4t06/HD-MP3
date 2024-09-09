import { useRef } from "react";
import useScrollText from "../hooks/useScrollText";

type Props = {
   content: string;
   autoScroll?: boolean;
   className: string;
};

export default function ScrollText({ content, className }: Props) {
   const textWrapperRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);

   // use hooks
   useScrollText({ textRef, textWrapperRef, content });

   return (
      <div
         ref={textWrapperRef}
         className="overflow-hidden translate-x-[-5px] mask-image-horizontal relative h-full "
      >
         <div
            ref={textRef}
            className={`min-w-full absolute left-0 whitespace-nowrap ${className}`}
         >
            {content || "..."}
         </div>
      </div>
   );
}

import { memo, useRef } from "react";
import useScrollText from "../hooks/useScrollText";

type Props = {
   content: string;
   autoScroll?: boolean;
   className: string;
};

function ScrollText({ content, className }: Props) {
   const textWrapperRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);

   // use hooks
   useScrollText({ textRef, textWrapperRef, content });

   return (
      <div
         ref={textWrapperRef}
         className="overflow-hidden relative h-full "
      >
         <div
            ref={textRef}
            className={`absolute left-0 whitespace-nowrap ${className}`}
         >
            {content || "..."}
         </div>
      </div>
   );
}


export default memo(ScrollText)
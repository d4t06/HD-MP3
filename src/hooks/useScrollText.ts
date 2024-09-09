import { RefObject, useEffect, useRef } from "react";

type Props = {
   textRef: RefObject<HTMLDivElement>;
   textWrapperRef: RefObject<HTMLDivElement>;
   content: string;
};

export default function useScrollText({
   textRef,
   textWrapperRef,
   content,
}: Props) {
   // red
   const autoScrollTimerId = useRef<NodeJS.Timeout>();
   const unScrollTimerId = useRef<NodeJS.Timeout>();

   const isOverflow = useRef(false);

   // const innerText = useRef<string>("");
   const duration = useRef<number>(0);
   const distance = useRef<number>(0);

   const unScroll = () => {
      if (!textRef.current) return;

      textRef.current.style.transition = `none`;
      textRef.current.style.transform = `translateX(5px)`;
   };

   const scroll = () => {
      if (
         // !isOverflow.current ||
         !duration.current ||
         !distance.current ||
         !textRef.current
      )
         return;

      textRef.current.style.transition = `transform linear ${duration.current}s`;
      textRef.current.style.transform = `translateX(-${distance.current}px)`;

      unScrollTimerId.current = setTimeout(unScroll, duration.current * 1000);
   };

   const calc = () => {
      if (!textRef.current || !textWrapperRef.current) return;

      distance.current = textRef.current.offsetWidth + 20;
      duration.current = Math.ceil(distance.current / 35);
   };

   const handleReset = () => {
      if (!isOverflow.current) return;

      console.log("handleReset");

      clearInterval(autoScrollTimerId.current);
      clearTimeout(unScrollTimerId.current);
      duration.current = 0;
      distance.current = 0;
      isOverflow.current = false;

      unScroll();
   };

   const handleScroll = () => {
      if (!textRef.current || !textWrapperRef.current || !content) return;

      if (isOverflow.current) return;

      const newOverflow =
         textRef.current.offsetWidth - 5 > textWrapperRef.current.offsetWidth;
      if (!newOverflow) return;

      isOverflow.current = true;

      calc();

      console.log("handle");

      textRef.current.innerHTML =
         textRef.current.innerText +
         "&nbsp; &nbsp; &nbsp;" +
         textRef.current.innerText;

      setTimeout(scroll, 1000);

      autoScrollTimerId.current = setInterval(
         scroll,
         duration.current * 1000 + 3000
      );
   };

   // useEffect(() => {
   //    if (textRef?.current && textWrapperRef?.current) {
   //       textWrapperRef.current.style.height =
   //          textRef.current.clientHeight + "px";
   //    }
   // }, [content]);

   useEffect(() => {
      // if (isOverflow.current) return;
      handleScroll();

      return () => {
         handleReset();
      };
   }, [content]);
}

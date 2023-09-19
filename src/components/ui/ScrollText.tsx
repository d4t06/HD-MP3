import { useEffect, useRef, useState } from "react";
import { Song } from "../../types";

type Props = {
   label: string;
   autoScroll?: boolean;
   classNames: string;
   songInStore?: Song;
};

export default function ScrollText({
   label,
   classNames,
   autoScroll,
   songInStore,
}: Props) {
   const textWrapper = useRef<HTMLDivElement>(null);
   const text = useRef<HTMLDivElement>(null);

   const autoScrollTimerId = useRef<NodeJS.Timeout>();
   const unScrollTimerId = useRef<NodeJS.Timeout>();
   const duration = useRef<number>(0);
   const innerText = useRef<string>("");
   const distance = useRef<number>(0);

   const [isScroll, setIsScroll] = useState(false);

   const unScroll = () => {
      const contentNode = text.current as HTMLElement;

      if (!contentNode) return;


      contentNode.style.transition = `none`;
      contentNode.style.transform = `translateX(0)`;
      setIsScroll(false);
   };

   const scroll = () => {
      // console.log('check duration, distance', duration.current, distance.current);
      
      if (!duration.current && !distance.current) return;
      const contentNode = text.current as HTMLElement;

      if (!contentNode) return;
      // console.log("scroll text");


      // duplicate innerText
      contentNode.innerHTML =
         innerText.current + "&nbsp; &nbsp; &nbsp;" + innerText.current;

      setIsScroll(true);
      // add animation
      contentNode.style.transition = `transform linear ${duration.current}s`;
      contentNode.style.transform = `translateX(-${distance.current}px)`;

      unScrollTimerId.current = setTimeout(() => {
         // remove animation
         unScroll()
      }, duration.current * 1000);
   };

   const handleScrollText = () => {
      if (isScroll) return;

      const contentNode = text.current as HTMLElement;
      const wrapperNode = textWrapper.current as HTMLElement;

      if (!contentNode || !wrapperNode) return;

      let isOverFlow =
         contentNode.offsetWidth - wrapperNode.offsetWidth > 0 ? true : false;

      // if innerText less than container
      if (!isOverFlow) return;

      innerText.current = contentNode.innerText;

      // scroll distance
      distance.current = contentNode.offsetWidth + 20;
      duration.current = +(distance.current / 35).toFixed(1);
   };

   useEffect(() => {
      handleScrollText();

      if (!distance.current) return;
      if (autoScroll) {
         if (duration.current && !isScroll) {
            setTimeout(() => {
               scroll();
            }, 1000);

            autoScrollTimerId.current = setInterval(() => {
                console.log('scroll');
                
               scroll();
            }, duration.current * 1000 + 3000 + 1000);
         }
      }  

      return () => {
         console.log('run cleanup')
         clearInterval(autoScrollTimerId.current);
         clearTimeout(unScrollTimerId.current)

         if (innerText.current) {
            unScroll();
            duration.current = 0;
            distance.current = 0;
         }
      };
   }, [songInStore && songInStore]);

   return (
      <div ref={textWrapper} className="overflow-hidden scroll-smooth relative h-full">
         <div
            ref={text}
            onClick={() => !autoScroll && handleScrollText()}
            className={`${classNames} absolute left-0 whitespace-nowrap line-clamp-1`}
         >
            {label || "Some song"}
         </div>
      </div>
   );
}

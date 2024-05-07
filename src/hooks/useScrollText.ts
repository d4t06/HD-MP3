import { RefObject, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";

type Props = {
   textRef?: RefObject<HTMLDivElement>;
   textWrapperRef?: RefObject<HTMLDivElement>;
   autoScroll?: boolean;
};

export default function useScrollText({ textRef, textWrapperRef, autoScroll }: Props) {
   const { song: songInStore } = useSelector(selectAllSongStore);
   const {
      playStatus: { isPlaying },
   } = useSelector(selectAllPlayStatusStore);

   const autoScrollTimerId = useRef<NodeJS.Timeout>();
   const unScrollTimerId = useRef<NodeJS.Timeout>();
   const duration = useRef<number>(0);
   const innerText = useRef<string>("");
   const distance = useRef<number>(0);

   // const [isScroll, setIsScroll] = useState(false);
   const isScrollRef = useRef(false);

   const unScroll = useCallback(() => {
      const contentNode = textRef?.current as HTMLElement;
      if (!contentNode) return;

      contentNode.style.transition = `none`;
      contentNode.style.transform = `translateX(0)`;
      contentNode.innerText = innerText.current;
      isScrollRef.current = false;
   }, [textRef]);

   const scroll = () => {
      if (!textRef) {
         console.log("lack of prop");
         return;
      }

      if (!duration.current && !distance.current) return;
      const contentNode = textRef.current as HTMLElement;
      if (!contentNode) return;
      console.log("scroll");

      // duplicate innerText
      contentNode.innerHTML = innerText.current + "&nbsp; &nbsp; &nbsp;" + innerText.current;
      isScrollRef.current = true;
      // add animation
      contentNode.style.transition = `transform linear ${duration.current}s`;
      contentNode.style.transform = `translateX(-${distance.current}px)`;

      unScrollTimerId.current = setTimeout(() => {
         unScroll();
         console.log("call unscroll");
      }, duration.current * 1000);
   };

   const reScroll = () => {
      if (!autoScroll) return;
      if (!textRef || !textWrapperRef) return;
      if (isScrollRef.current) {
         console.log("reScroll cancel cause is scroll");
         return;
      }

      const contentNode = textRef.current as HTMLElement;
      const wrapperNode = textWrapperRef.current as HTMLElement;

      let isOverFlow = contentNode.offsetWidth - wrapperNode.offsetWidth > 0 ? true : false;
      // if innerText less than container
      if (!isOverFlow) return;
      // assign stock text
      innerText.current = contentNode.innerText;
      // scroll distance
      distance.current = contentNode.offsetWidth + 20;
      duration.current = Math.ceil(distance.current / 35);

      // console.log("reScroll dis", distance.current);
   };

   const resetScroll = () => {
      unScroll();
      duration.current = 0;
      distance.current = 0;
   };

   useEffect(() => {
      if (!songInStore.name || !isPlaying) return;

      reScroll();
      if (!distance.current) return;

      if (autoScroll) {
         if (duration.current && !isScrollRef.current) {
            setTimeout(() => {
               scroll();
            }, 1000);

            autoScrollTimerId.current = setInterval(() => {
               scroll();
            }, duration.current * 1000 + 3000 + 1000);
         }
      }

      return () => {
         clearInterval(autoScrollTimerId.current);
         clearTimeout(unScrollTimerId.current);

         resetScroll();
      };
   }, [songInStore, isPlaying]);
} 

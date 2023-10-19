import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import { useToast } from "../store/ToastContext";

type Props = {
   text?: RefObject<HTMLDivElement>;
   textWrapper?: RefObject<HTMLDivElement>;
   autoScroll?: boolean;
};

export default function useScrollText({ text, textWrapper, autoScroll }: Props) {
   const { song: songInStore } = useSelector(selectAllSongStore);
   const {setErrorToast} = useToast()

   const autoScrollTimerId = useRef<NodeJS.Timeout>();
   const unScrollTimerId = useRef<NodeJS.Timeout>();
   const duration = useRef<number>(0);
   const innerText = useRef<string>("");
   const distance = useRef<number>(0);

   const [isScroll, setIsScroll] = useState(false);

   const unScroll = useCallback(() => {
      if (!text) {
         console.log("lack props");
         return;
      }

      const contentNode = text.current as HTMLElement;
      if (!contentNode) return;

      contentNode.style.transition = `none`;
      contentNode.style.transform = `translateX(0)`;

      setIsScroll(false);
   }, [text]);

   const scroll = useCallback(() => {
      if (!text) {
         console.log("lack of prop");
         return;
      }

      if (!duration.current && !distance.current) return;
      const contentNode = text.current as HTMLElement;

      if (!contentNode) return;
      // console.log("scroll text");

      // duplicate innerText
      contentNode.innerHTML = innerText.current + "&nbsp; &nbsp; &nbsp;" + innerText.current;

      setIsScroll(true);
      // add animation
      contentNode.style.transition = `transform linear ${duration.current}s`;
      contentNode.style.transform = `translateX(-${distance.current}px)`;

      unScrollTimerId.current = setTimeout(() => {
         unScroll();
      }, duration.current * 1000);
   }, [text, textWrapper]);

   const handleScrollText = useCallback(() => {
      if (!autoScroll) return;
      if (!text || !textWrapper) return;
      if (isScroll) return;

      const contentNode = text.current as HTMLElement;
      const wrapperNode = textWrapper.current as HTMLElement;

      let isOverFlow = contentNode.offsetWidth - wrapperNode.offsetWidth > 0 ? true : false;

      // if innerText less than container
      if (!isOverFlow) return;

      innerText.current = contentNode.innerText;

      // scroll distance
      distance.current = contentNode.offsetWidth + 20;
      duration.current = +(distance.current / 35).toFixed(1);
   }, [isScroll, text, textWrapper]);

   useEffect(() => {
      if (!songInStore.name) return;

      handleScrollText();

      if (!distance.current) return;

      if (autoScroll) {
         if (duration.current && !isScroll) {
            setTimeout(() => {
               scroll();
            }, 1000);

            autoScrollTimerId.current = setInterval(() => {

               scroll();
            }, duration.current * 1000 + 3000 + 1000);
         }
      }

      return () => {
         if (autoScrollTimerId.current) {
            clearInterval(autoScrollTimerId.current);
            console.log('clear timer');
            
         } else {
            console.log("No timer id");
            setErrorToast({})
         }
         
         if (unScrollTimerId.current) {
            clearTimeout(unScrollTimerId.current);
         } else {
            console.log("No timer id");
            setErrorToast({})

         }

         if (innerText.current) {
            unScroll();
            duration.current = 0;
            distance.current = 0;
         }
      };
   }, [songInStore]);
}

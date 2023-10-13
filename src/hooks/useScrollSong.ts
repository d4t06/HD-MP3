import { MutableRefObject, RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";

type Props = {
   containerRef?: RefObject<HTMLDivElement>;
   songItemRef?: RefObject<HTMLDivElement>;
   firstTimeRender: MutableRefObject<Boolean>
   isOpenFullScreen?: boolean;
};

export default function useScrollSong({ containerRef, songItemRef, firstTimeRender, isOpenFullScreen}: Props) {
   const {song: songInStore} = useSelector(selectAllSongStore)
   if (!scroll || !containerRef || !songItemRef) return;

   useEffect(() => {
      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         return;
      }

      if (!songInStore.name) return;
      
      if (!isOpenFullScreen) {
         console.log('useEffect no open full screen, do nothing');
         return;
      }      

      if (containerRef && songItemRef) {

         const windowWidth = window.innerWidth;

         const songItemEle = songItemRef.current as HTMLElement;
         const containerEle = containerRef.current as HTMLElement;

         const rect = songItemEle.getBoundingClientRect();

         const lefDiff = rect.left;
         const rightDiff = windowWidth - (lefDiff + songItemEle.offsetWidth);

         const needToScroll = Math.abs(lefDiff - rightDiff) / 2;

         // console.log('song thumbnail check scroll, left ', lefDiff, 'right ', rightDiff )

         // if element not in screen
         if (Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
            containerEle.style.scrollBehavior = "auto";
         }

         // on the left side
         if (rightDiff > lefDiff) {
            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft - needToScroll;
               containerEle.style.scrollBehavior = "smooth";
            }, 300);

            // on the right side
         } else if (rightDiff < lefDiff) {
            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft + needToScroll;
               containerEle.style.scrollBehavior = "smooth";
            }, 300);
         }
      } else {
         console.log('element undefined');
         
      }
   }, [songInStore, isOpenFullScreen]);
}

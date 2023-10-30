import { MutableRefObject, RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";

type Props = {
   containerRef?: RefObject<HTMLDivElement>;
   songItemRef?: RefObject<HTMLDivElement>;
   firstTimeRender: MutableRefObject<Boolean>;
   isOpenFullScreen?: boolean;
};

export default function useScrollSong({
   containerRef,
   songItemRef,
   firstTimeRender,
   isOpenFullScreen,
}: Props) {
   const { song: songInStore } = useSelector(selectAllSongStore);

   const scrollToActiveSong = () => {
      if (!songItemRef || !containerRef) return;

      const windowWidth = window.innerWidth;

      const songItemEle = songItemRef.current as HTMLElement;
      const containerEle = containerRef.current as HTMLElement;

      const rect = songItemEle.getBoundingClientRect();

      const lefDiff = rect.left;
      const rightDiff = windowWidth - (lefDiff + songItemEle.offsetWidth);

      const needToScroll = Math.abs(Math.ceil(lefDiff - rightDiff)) / 2;

      // console.log('song thumbnail check scroll, left ', lefDiff, 'right ', rightDiff )

      // if element not in screen
      if (Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
         containerEle.style.scrollBehavior = "auto";
      } else {
         containerEle.style.scrollBehavior = "smooth";
      }

      // on the left side
      let newScroll = containerEle.scrollLeft;
      if (rightDiff > lefDiff) {
         setTimeout(() => {
            containerEle.scrollLeft = newScroll - needToScroll;
         }, 300);

         // on the right side
      } else if (rightDiff < lefDiff) {
         // newScroll += needToScroll;
         setTimeout(() => {
            containerEle.scrollLeft = newScroll + needToScroll;
         }, 300);
      }
   };

   useEffect(() => {
      if (!scroll || !containerRef || !songItemRef) return;

      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         return;
      }

      if (!songInStore.name) return;

      if (!isOpenFullScreen) {
         return;
      }

      if (containerRef) {
         scrollToActiveSong();
      } else {
         console.log("element undefined");
      }
   }, [songInStore, isOpenFullScreen]);

   return { scrollToActiveSong };
}

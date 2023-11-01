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
   isOpenFullScreen,
}: Props) {
   const { song: songInStore } = useSelector(selectAllSongStore);

   const scrollToActiveSong = () => {
      const windowWidth = window.innerWidth;
      const songItemEle = songItemRef?.current as HTMLElement;
      const containerEle = containerRef?.current as HTMLElement;

      if (!songItemEle || !containerEle) return;

      const rect = songItemEle.getBoundingClientRect();

      const lefDiff = rect.left;
      const rightDiff = windowWidth - (lefDiff + songItemEle.offsetWidth);

      const needToScroll = Math.abs(Math.ceil(lefDiff - rightDiff)) / 2;

      // case element position don't change
      if (needToScroll === 0) return;

      // case element not in view
      if (Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
         containerEle.style.scrollBehavior = "auto";
      } else {
         containerEle.style.scrollBehavior = "smooth";
      }

      // case in view
      //on the left side
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
      if (!isOpenFullScreen) return;
      if (!scroll || !containerRef?.current || !songItemRef?.current) {
         console.log("lack props");
         return;
      }

      if (!songInStore.name) return;

      if (!isOpenFullScreen) {
         return;
      }

      scrollToActiveSong();
   }, [songInStore, isOpenFullScreen]);

   return { scrollToActiveSong };
}

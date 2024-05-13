import { RefObject, useEffect } from "react";
;

export default function useBgImage({
   bgRef,
   currentSong,
}: {
   bgRef: RefObject<HTMLDivElement>;
   currentSong: Song;
}) {
   useEffect(() => {
      if (currentSong.image_url) {
         const node = bgRef.current as HTMLElement;
         if (node) {
            node.style.backgroundImage = `url(${currentSong.image_url})`;
         }
      }
   }, [currentSong]);
}

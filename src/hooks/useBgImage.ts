import { RefObject, useEffect } from "react";
import { Song } from "../types";

export default function useBgImage({
   bgRef,
   songInStore,
}: {
   bgRef: RefObject<HTMLDivElement>;
   songInStore: Song;
}) {
   useEffect(() => {
      if (songInStore.image_url) {
         const node = bgRef.current as HTMLElement;
         if (node) {
            node.style.backgroundImage = `url(${songInStore.image_url})`;
         }
      }
   }, [songInStore]);
}

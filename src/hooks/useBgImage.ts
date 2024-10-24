import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
export default function useBgImage({
  bgRef,
  currentSong,
}: {
  bgRef: RefObject<HTMLDivElement>;
  currentSong: Song | null;
}) {
  const {
     songBackground 
  } = useSelector(selectAllPlayStatusStore);

  useEffect(() => {
    if (!songBackground) return;
    if (currentSong) {
      const node = bgRef.current as HTMLElement;
      if (node) {
        node.style.backgroundImage = `url(${currentSong.image_url})`;
      }
    }
  }, [currentSong, songBackground]);

  useEffect(() => {
    if (!songBackground) {
      const node = bgRef.current as HTMLElement;
      if (node) {
        node.style.backgroundImage = "none";
      }
    }
  }, [songBackground]);
}

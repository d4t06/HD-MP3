import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSongsContext } from "../_stores/SongsContext";
import SongCard from "@/modules/song-card";
import useGetForYouSongs from "../_hooks/useForYouSongs";

export default function SongList() {
  const { setCurrentIndex, songs } = useSongsContext();

  const { isFetching } = useGetForYouSongs();

  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((el: HTMLDivElement) => {
    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("get song ");
      }
    });

    if (el) intObserver.current.observe(el);
  }, []);

  const content = useMemo(() => {
    return songs.map((item, index) => {
      if (songs.length === index + 1) {
        return <SongCard index={index} key={index} ref={lastElementRef} song={item} />;
      }
      return <SongCard index={index} key={index} song={item} />;
    });
  }, [songs]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentIndex(0);
    }, 1000);
  }, []);

  return (
    <div
      className={`relative transition-[right] duration-[.3s] h-full snap-y snap-mandatory overflow-auto no-scrollbar`}
    >
      {isFetching && <p>Loading</p>}

      {content}
    </div>
  );
}

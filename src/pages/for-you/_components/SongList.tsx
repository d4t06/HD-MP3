import { useEffect, useMemo } from "react";
import { useSongsContext } from "../_stores/SongsContext";
import SongCard from "@/modules/song-card";
import useGetForYouSongs from "../_hooks/useForYouSongs";
import { Center, Loading } from "@/components";
import usePlayCount from "../_hooks/usePlayCount";

export default function SongList() {
  const { setCurrentIndex, songs } = useSongsContext();

  const { isFetching, lastElementRef } = useGetForYouSongs();
  usePlayCount();

  const content = useMemo(() => {
    return songs.map((item, index) => {
      if (songs.length === index + 1) {
        return (
          <SongCard
            index={index}
            key={index}
            ref={lastElementRef}
            song={item}
          />
        );
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
      className={`h-full snap-y snap-mandatory overflow-auto no-scrollbar flex flex-col md:items-center`}
    >
      {isFetching && (
        <Center>
          <Loading />
        </Center>
      )}

      {content}
    </div>
  );
}

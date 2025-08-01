import { PlaylistList, Skeleton, Title } from "@/components";
import { songItemSkeleton } from "@/components/skeleton";
import { useGetPlaylists, useGetSongs, useSetSong } from "@/hooks";
import CheckedBar from "@/modules/check-bar";
import SongList from "@/modules/song-item/_components/SongList";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useState } from "react";

type Props = {
  songIds: string[];
};

export default function SongSection({ songIds }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);

  const { handleSetSong } = useSetSong({ variant: "songs" });

  // const loadingElement = [...Array(4).keys()].map((i) => (
  //   <Skeleton key={i} className="aspect-[1/1]" />
  // ));

  const { isFetching } = useGetSongs({ setSongs, songIds });
  if (isFetching) return songItemSkeleton;

  if (!songs.length) return <></>;

  return (
    <SongSelectProvider>
      <div className="mt-5">
        <CheckedBar variant="system-song">
          <Title title="Hot songs" />
        </CheckedBar>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-3">
          <SongList
            songs={songs}
            setSong={(s) => handleSetSong(s.queue_id, songs)}
          />
        </div>
      </div>
    </SongSelectProvider>
  );
}

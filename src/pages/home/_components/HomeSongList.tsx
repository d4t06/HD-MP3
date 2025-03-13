import { Title } from "@/components";
import Tab from "@/components/Tab";
import useGetHomeSong from "../_hooks/useGetHomeSong";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";

export default function HomeSongList() {
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { isFetching, songMap, ...rest } = useGetHomeSong();

  return (
    <>
      <Title title="Song" />

      <div className="flex space-x-2 my-3">
        <Tab render={(t) => t} {...rest} />
      </div>
      <SongSelectProvider>
        <SongList
          songs={songMap[rest.tab].songs}
          setSong={(s) => handleSetSong(s.queue_id, [s])}
        />
      </SongSelectProvider>
    </>
  );
}

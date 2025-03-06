import { SongItem } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";

type Props = {
  songs: Song[];
};
export default function SearchbarSongList({ songs }: Props) {
  const { handleSetSong } = useSetSong({ variant: "search-bar" });
  const { currentQueueId } = useSelector(selectSongQueue);

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
  };

  return (
    <SongSelectProvider>
      {!!songs.length ? (
        songs.map((song, index) => (
          <SongItem
            active={song.queue_id === currentQueueId}
            onClick={() => _handleSetSong(song)}
            variant="sys-song"
            isHasCheckBox
            song={song}
            index={index}
            key={song.queue_id}
          />
        ))
      ) : (
        <h1 className="text-[22px] text-center">...</h1>
      )}
    </SongSelectProvider>
  );
}

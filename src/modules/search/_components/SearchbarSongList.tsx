import { NotFound } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import SongList from "@/modules/song-item/_components/SongList";
import SongSelectProvider from "@/stores/SongSelectContext";

type Props = {
  songs: Song[];
};
export default function SearchbarSongList({ songs }: Props) {
  const { handleSetSong } = useSetSong({ variant: "search-bar" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
  };

  return (
    <SongSelectProvider>
      {!!songs.length ? (
        <SongList isHasCheckBox={false} setSong={_handleSetSong} songs={songs} />
      ) : (
        <NotFound />
      )}
    </SongSelectProvider>
  );
}

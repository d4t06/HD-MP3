import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import SongList from "./SongList";

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
        <SongList variant="search-bar" handleSetSong={_handleSetSong} songs={songs} />
      ) : (
        <h1 className="text-[22px] text-center">...</h1>
      )}
    </SongSelectProvider>
  );
}

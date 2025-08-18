import { NotFound } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import SongList from "@/modules/song-item/_components/SongList";
import SongSelectProvider from "@/stores/SongSelectContext";
import { RecentSearch } from "../_hooks/useSearch";
import useGetRelativeSongs from "@/modules/song-queue/_hooks/useGetRelativeSongs";
import { pushRecentSearch } from "../_hooks/pushRecentSearch";

type Props = {
  songs: Song[];
};
export default function SearchbarSongList({ songs }: Props) {
  const { handleSetSong } = useSetSong({ variant: "search-bar" });

  const { getRelatigeSongs } = useGetRelativeSongs();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);

    const newRecentSerchItem: RecentSearch = {
      variant: "song",
      item: song,
    };

    pushRecentSearch(newRecentSerchItem);

    getRelatigeSongs(song);
  };

  return (
    <>
      <div className="text-sm font-bold mb-2">Suggestion results</div>

      <div className={`overflow-auto no-scrollbar`}>
        <SongSelectProvider>
          {!!songs.length ? (
            <SongList
              isHasCheckBox={false}
              setSong={_handleSetSong}
              songs={songs}
            />
          ) : (
            <NotFound />
          )}
        </SongSelectProvider>
      </div>
    </>
  );
}

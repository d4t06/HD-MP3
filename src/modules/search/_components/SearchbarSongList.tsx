import { NotFound } from "@/components";
import useGetRecommend from "@/hooks/useGetRecomemded";
import useSetSong from "@/hooks/useSetSong";
import SongList from "@/modules/song-item/_components/SongList";
import SongSelectProvider from "@/stores/SongSelectContext";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { RecentSearch } from "../_hooks/useSearch";

type Props = {
  songs: Song[];
};
export default function SearchbarSongList({ songs }: Props) {
  const { handleSetSong } = useSetSong({ variant: "search-bar" });

  const { getRecommend } = useGetRecommend();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);

    const recentSearchs: RecentSearch[] =
      getLocalStorage()["recent-search"] || [];
    recentSearchs.unshift({
      variant: "song",
      item: song,
    });

    setLocalStorage("recent-search", recentSearchs);

    getRecommend(song);
  };

  return (
    <SongSelectProvider>
      {!!songs.length ? (
        <SongList
          songVariant="queue-song"
          isHasCheckBox={false}
          setSong={_handleSetSong}
          songs={songs}
        />
      ) : (
        <NotFound />
      )}
    </SongSelectProvider>
  );
}

import { useSongSelectContext } from "@/stores";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";
import useSearchSong from "./useSearchSong";

export default function useAddSongToPlaylistModal() {
  const { selectedSongs, selectSong } = useSongSelectContext();

  const rest = useSearchSong();
  const { action, isFetching: actionFetching } = useDashboardPlaylistActions();

  const handleAddSongsToPlaylist = async () => {
    if (!selectedSongs.length) return;
    await action({ variant: "add-songs", songs: selectedSongs });
  };

  return {
    ...rest,
    handleAddSongsToPlaylist,
    selectedSongs,
    selectSong,
    actionFetching,
  };
}

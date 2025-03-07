import { searchSong } from "@/services/appService";
import { useSongSelectContext, useToastContext } from "@/stores";
import { FormEvent, useState } from "react";
import useDashboardPlaylistActions from "./usePlaylistAction";

export default function useAddSongToPlaylistModal() {
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  const { selectedSongs, selectSong } = useSongSelectContext();

  const { actions, isFetching: actionFetching } = useDashboardPlaylistActions();
  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const songs = await searchSong(value);

      if (songs) setSongs(songs);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddSongsToPlaylist = async () => {
    if (!selectedSongs.length) return;
    await actions({ variant: "add-songs", songs: selectedSongs });
  };

  return {
    value,
    setValue,
    isFetching,
    handleSubmit,
    handleAddSongsToPlaylist,
    songs,
    selectedSongs,
    selectSong,
    actionFetching,
  };
}

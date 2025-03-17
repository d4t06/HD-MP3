import { useToastContext } from "@/stores";
import { useState } from "react";
import { useSongSelectContext } from "@/stores/SongSelectContext";
import { useDispatch } from "react-redux";
import { addSongToQueue } from "@/stores/redux/songQueueSlice";
// import usePlaylistAction from "@/hooks/usePlaylistAction";

export default function useCheckBar() {
  const dispatch = useDispatch();

  const { selectedSongs, resetSelect } = useSongSelectContext();

  // state
  const [isFetching] = useState(false);
  // hooks
  const { setSuccessToast } = useToastContext();
  // const { removeSelectSongs } = usePlaylistAction();

  //   const deleteSelectedSong = async () => {
  //     try {
  //       if (!user) return;

  //       setIsFetching(true);

  //       const selectedSongIds = selectedSongs.map((s) => s.id);
  //       // >>> api
  //       for (let song of selectedSongs) await deleteSong(song);

  //       const newSongs = songs.filter((s) => !selectedSongIds.includes(s.id));

  //       setSongs(newSongs);
  //       setSuccessToast(`${selectedSongs.length} songs deleted`);
  //     } catch (error) {
  //       console.log({ message: error });
  //       setErrorToast();
  //     } finally {
  //       resetSelect();
  //       setIsFetching(false);
  //       modalRef.current?.close();
  //     }
  //   };

  // const removeSelectedSongFromPlaylist = async () => {
  //   await removeSelectSongs(selectedSongs, setIsFetching);
  //   modalRef.current?.close();
  //   resetSelect();
  // };

  const addSongsToQueue = () => {
    dispatch(addSongToQueue({ songs: selectedSongs }));
    setSuccessToast("songs added to queue");
    resetSelect();
  };

  return {
    addSongsToQueue,
    isFetching,
  };
}

import { useAuthStore, useSongContext, useToast } from "@/store";
import { RefObject, useState } from "react";
import usePlaylistActions from "./usePlaylistAction";
import { useSongSelectContext } from "@/store/SongSelectContext";
import { deleteSong } from "@/services/firebaseService";
import { ModalRef } from "@/components/Modal";
import { useDispatch } from "react-redux";
import { addSongToQueue } from "@/store/songQueueSlice";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useCheckBar({ modalRef }: Props) {
  const dispatch = useDispatch();

  const { user } = useAuthStore();
  const { selectedSongs, resetSelect } = useSongSelectContext();
  const { songs, setSongs } = useSongContext();

  // state
  const [isFetching, setIsFetching] = useState(false);
  // hooks
  const { setErrorToast, setSuccessToast } = useToast();
  const { removeSelectSongs } = usePlaylistActions();

  const deleteSelectedSong = async () => {
    try {
      if (!user) return;

      setIsFetching(true);

      const selectedSongIds = selectedSongs.map((s) => s.id);
      // >>> api
      for (let song of selectedSongs) await deleteSong(song);

      const newSongs = songs.filter((s) => !selectedSongIds.includes(s.id));

      setSongs(newSongs);
      setSuccessToast(`${selectedSongs.length} songs deleted`);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      resetSelect();
      setIsFetching(false);
      modalRef.current?.close();
    }
  };

  const removeSelectedSongFromPlaylist = async () => {
    await removeSelectSongs(selectedSongs, setIsFetching);
    modalRef.current?.close();
    resetSelect();
  };

  const addSongsToQueue = () => {
    dispatch(addSongToQueue({ songs: selectedSongs }));
    setSuccessToast("songs added to queue");
    resetSelect();
  };

  return {
    deleteSelectedSong,
    removeSelectedSongFromPlaylist,
    addSongsToQueue,
    isFetching,
  };
}

import { useSongsStore } from "@/store/SongsContext";
import { RefObject, useState } from "react";
import { useToast } from "../store";
// import { useDispatch, useSelector } from "react-redux"/;

import usePlaylistActions from "./usePlaylistActions";
// import { resetCurrentSong, selectCurrentSong } from "@/store/currentSongSlice";
import { deleteSong } from "@/services/firebaseService";
import { TriggerRef } from "@/components/MyPopup";
// import { selectSongQueue } from "@/store/songQueueSlice";

type Props = {
  song: Song;
  admin?: boolean;
  closeModal: () => void;
  triggerRef: RefObject<TriggerRef>;
};

const useSongItemActions = ({ song, closeModal, triggerRef }: Props) => {
  // store
//   const dispatch = useDispatch();
  const { setErrorToast, setSuccessToast } = useToast();
//   const { currentSongData } = useSelector(selectSongQueue);
  const { userSongs, setUserSongs } = useSongsStore();

  // state

  const [loading, setLoading] = useState(false);

  // hook
  const { removeSong, addSongsSongItem } = usePlaylistActions();

  // must use middle variable 'song' to add to playlist in mobile device
  const handleAddSongToPlaylistMobile = async (playlist: Playlist) => {
    try {
      setLoading(true);
      // await addSongsSongItem(song, playlist);
      setSuccessToast(`'${song.name}' added to '${playlist.name}'`);
    } catch (error) {
      console.log(error);
      throw new Error("Error when add song to playlist");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleDeleteSong = async () => {
    try {
      setLoading(true);

      const newSongs = userSongs.filter((s) => s.id !== song.id);

      await deleteSong(song);
      setUserSongs(newSongs);

      // if (currentSongData?.song?.id === song.id) dispatch(resetCurrentSong());
      setSuccessToast(`'${song.name}' deleted`);
    } catch (error) {
      console.log({ message: error });
      throw new Error("Error when delete song");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleAddSongToPlaylist = async (playlist: Playlist) => {
    if (!song || !playlist) {
      setErrorToast("Lack of props");
      return;
    }
    try {
      setLoading(true);
      await addSongsSongItem(song, playlist);
      setSuccessToast(`'${song.name}' added to '${playlist.name}'`);
    } catch (error) {
      console.log(error);
      throw new Error("Error when add song to playlist");
    } finally {
      setLoading(false);
      triggerRef.current?.close();
    }
  };

  const handleRemoveSongFromPlaylist = async () => {
    await removeSong(song, setLoading);
  };

  return {
    //  updateAndSetUserSongs,
    handleDeleteSong,
    handleAddSongToPlaylistMobile,
    handleRemoveSongFromPlaylist,
    handleAddSongToPlaylist,
    loading,
  };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

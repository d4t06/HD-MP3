import { useSongsStore } from "@/store/SongsContext";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useToast } from "../store";
import { deleteSong } from "@/services/firebaseService";
import { useDispatch, useSelector } from "react-redux";

import usePlaylistActions from "./usePlaylistActions";
import { resetCurrentSong, selectCurrentSong } from "@/store/currentSongSlice";

type Props = {
  song: Song;
  admin?: boolean;
  closeModal: () => void;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
};

const useSongItemActions = ({ song, closeModal, setIsOpenPopup }: Props) => {
  // store
  const dispatch = useDispatch();
  const { setErrorToast, setSuccessToast } = useToast();
  const { currentSong } = useSelector(selectCurrentSong);
  const { userSongs, setUserSongs } = useSongsStore();

  // state

  const [loading, setLoading] = useState(false);

  // hook
  const { addSongToPlaylistSongItem, deleteSongFromPlaylist } = usePlaylistActions();

  const updateAndSetUserSongs = useCallback(
    async ({ song }: { song: Song }) => {
      // reference copy newUserSongIds = userSongIds;
      let newUserSongs = [...userSongs];

      // eliminate 1 song
      const index = newUserSongs.indexOf(song);
      newUserSongs.splice(index, 1);

      const newUserSongIds = newUserSongs.map((songItem) => songItem.id);

      if (newUserSongs.length === userSongs.length) {
        return;
      }

      setUserSongs(newUserSongs);

      return newUserSongIds;
    },
    [userSongs]
  );

  // must use middle variable 'song' to add to playlist in mobile device
  const handleAddSongToPlaylistMobile = async (playlist: Playlist) => {
    try {
      setLoading(true);
      await addSongToPlaylistSongItem(song, playlist);
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
      let newSongs = [...userSongs];

      const index = newSongs.indexOf(song);
      newSongs.splice(index, 1);

      await deleteSong(song);

      setUserSongs(newSongs);
      // no handle song queue

      if (currentSong?.id === song.id) dispatch(resetCurrentSong());

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
      await addSongToPlaylistSongItem(song, playlist);
      setSuccessToast(`'${song.name}' added to '${playlist.name}'`);
    } catch (error) {
      console.log(error);
      throw new Error("Error when add song to playlist");
    } finally {
      setLoading(false);
      setIsOpenPopup(false);
    }
  };

  const handleRemoveSongFromPlaylist = async () => {
    try {
      setLoading(true);
      await deleteSongFromPlaylist(song);
    } catch (error) {
      console.log({ message: error });
      throw new Error("Error when remove song from playlist");
    } finally {
      setLoading(false);
      setIsOpenPopup(false);
    }
  };

  return {
    updateAndSetUserSongs,
    handleDeleteSong,
    handleAddSongToPlaylistMobile,
    handleRemoveSongFromPlaylist,
    handleAddSongToPlaylist,
    loading,
  };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

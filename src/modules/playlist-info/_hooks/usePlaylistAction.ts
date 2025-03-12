import { useState } from "react";
import { useAuthContext, useToastContext } from "@/stores";
import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCurrentPlaylist,
  setPlaylistSong,
  updateCurrentPlaylist,
} from "@/stores/redux/currentPlaylistSlice";

export default function usePlaylistAction() {
  // stores
  const dispatch = useDispatch();
  const { user, updateUserData } = useAuthContext();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const { setErrorToast, setSuccessToast } = useToastContext();
  const navigate = useNavigate();

  type EditPlaylist = {
    variant: "edit";
    playlist: Partial<Playlist>;
  };

  type LikePlaylist = {
    variant: "like";
    playlist: Playlist;
  };

  type DeletePlaylist = {
    variant: "delete";
  };

  const action = async (props: LikePlaylist | EditPlaylist | DeletePlaylist) => {
    try {
      if (!user) throw new Error("user not found");

      setIsFetching(true);

      switch (props.variant) {
        case "like": {
          if (!user) throw Error();

          const newLikedPlaylistIds = [...user.liked_song_ids];
          const index = newLikedPlaylistIds.findIndex((id) => id === props.playlist.id);

          if (index === -1) newLikedPlaylistIds.unshift(props.playlist.id);
          else newLikedPlaylistIds.splice(index, 1);

          const newUserData: Partial<User> = {
            liked_playlist_ids: newLikedPlaylistIds,
          };

          await myUpdateDoc({
            collectionName: "Users",
            data: newUserData,
            id: user.email,
          });

          updateUserData(newUserData);

          break;
        }
        case "edit":
          await myAddDoc({
            collectionName: "Playlists",
            data: { name: props.playlist.name },
            msg: ">>> api: set playlist doc",
          });

          dispatch(updateCurrentPlaylist({ name: props.playlist.name }));
          setSuccessToast("Playlist edited");

          break;

        case "delete":
          if (!currentPlaylist) throw new Error();

          await myDeleteDoc({
            collectionName: "Playlists",
            id: currentPlaylist.id,
            msg: ">>> api: delete playlist doc",
          });

          // await setUserPlaylistIdsDoc(newUserPlaylist, user);

          navigate("/mysongs");
      }
    } catch (err) {
      console.log({ message: err });
      throw new Error("Error when do playlist action");
    } finally {
      setIsFetching(false);
    }
  };

  const removeSelectSongs = async (
    selectedSongs: Song[],
    _setIsFetching?: (v: boolean) => void
  ) => {
    try {
      if (!currentPlaylist || !playlistSongs.length) return;

      _setIsFetching ? _setIsFetching(true) : setIsFetching(true);

      const selectedSongIds = selectedSongs.map((s) => s.id);
      const newPlaylistSongs = [...playlistSongs].filter(
        (s) => !selectedSongIds.includes(s.id)
      );
      const newSongIds = newPlaylistSongs.map((s) => s.id);

      await myAddDoc({
        collectionName: "Playlists",
        data: { song_ids: newSongIds } as Partial<Playlist>,
        msg: ">>> api: update playlist doc",
      });

      dispatch(setPlaylistSong(newPlaylistSongs));

      setIsFetching(false);
      setSuccessToast(`${selectedSongs.length} songs removed`);

      return newPlaylistSongs;
    } catch (error) {
      setErrorToast();
      console.log({ message: error });
    } finally {
      _setIsFetching ? _setIsFetching(false) : setIsFetching(false);
    }
  };

  return {
    isFetching,
    removeSelectSongs,
    action,
    // addSongsSongItem,
  };
}

import { useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "../stores";
import { generateId, initPlaylistObject } from "../utils/appHelpers";
import { myDeleteDoc, mySetDoc, setUserPlaylistIdsDoc } from "@/services/firebaseService";
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
  const { user } = useAuthContext();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const { playlists } = useSongContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const { setErrorToast, setSuccessToast } = useToastContext();
  const navigate = useNavigate();

  type AddPlaylist = {
    variant: "add";
    name: string;
  };

  type EditPlaylist = {
    variant: "edit";
    playlist: Partial<Playlist>;
  };

  type DeletePlaylist = {
    variant: "delete";
  };

  const action = async (props: AddPlaylist | EditPlaylist | DeletePlaylist) => {
    try {
      if (!user) throw new Error("user not found");

      setIsFetching(true);

      switch (props.variant) {
        case "add":
          if (!props.name.trim()) throw new Error("playlist name invalid");

          const playlistId = generateId(props.name);

          const newPlaylist = initPlaylistObject({
            id: playlistId,
            by: user.email,
            name: props.name,
          });

          await mySetDoc({
            collection: "playlist",
            data: newPlaylist,
            id: playlistId,
            msg: ">>> api: set playlist doc",
          });

          const newPlaylists = [...playlists, newPlaylist];

          await setUserPlaylistIdsDoc(newPlaylists, user);

          break;

        case "edit":
          if (!currentPlaylist) throw new Error("Current playlist invalid");

          await mySetDoc({
            collection: "playlist",
            data: { name: props.playlist.name },
            id: currentPlaylist.id,
            msg: ">>> api: set playlist doc",
          });

          dispatch(updateCurrentPlaylist({ name: props.playlist.name }));
          setSuccessToast("Playlist edited");

          break;

        case "delete":
          if (!currentPlaylist) throw new Error("Current playlist invalid");

          const newUserPlaylist = playlists.filter((pl) => pl.id !== currentPlaylist.id);

          await myDeleteDoc({
            collection: "playlist",
            id: currentPlaylist.id,
            msg: ">>> api: delete playlist doc",
          });

          await setUserPlaylistIdsDoc(newUserPlaylist, user);

          navigate("/mysongs");
      }
    } catch (err) {
      console.log({ message: err });
      throw new Error("Error when do playlist action");
    } finally {
      setIsFetching(false);
    }
  };

  // const addPlaylist = async (playlistName: string) => {
  //   if (!user) throw new Error("user not found");
  //   if (!playlistName) throw new Error("playlist name invalid");

  //   const playlistId = generateId(playlistName);

  //   const addedPlaylist = initPlaylistObject({
  //     id: playlistId,
  //     by: user.email,
  //     name: playlistName,
  //   });

  //   setIsFetching(true);
  //   const newPlaylists = [...playlists, addedPlaylist];

  //   await mySetDoc({
  //     collection: "playlist",
  //     data: addedPlaylist,
  //     id: playlistId,
  //     msg: ">>> api: set playlist doc",
  //   });
  //   await setUserPlaylistIdsDoc(newPlaylists, user);

  //   newPlaylists;
  //   setIsFetching(false);
  // };

  // const deletePlaylist = async () => {
  //   if (!user || !currentPlaylist) return;

  //   setIsFetching(true);
  //   const newUserPlaylist = playlists.filter((pl) => pl.id !== currentPlaylist.id);

  //   await myDeleteDoc({
  //     collection: "playlist",
  //     id: currentPlaylist.id,
  //     msg: ">>> api: delete playlist doc",
  //   });

  //   await setUserPlaylistIdsDoc(newUserPlaylist, user);

  //   setIsFetching(false);
  //   navigate("/mysongs");
  // };

  // const addSongs = async (selectSongs: Song[]) => {
  //   try {
  //     if (!currentPlaylist) return;

  //     setIsFetching(true);
  //     const newSongIds = [
  //       ...playlistSongs.map((s) => s.id),
  //       ...selectSongs.map((s) => s.id),
  //     ];

  //     await mySetDoc({
  //       collection: "playlist",
  //       id: currentPlaylist?.id,
  //       data: { song_ids: newSongIds } as Partial<Playlist>,
  //       msg: ">>> api: update playlist doc",
  //     });

  //     // dispatch(addSongsToPlaylist(selectSongs));

  //     setSuccessToast(`${selectSongs.length} songs added`);
  //   } catch (error) {
  //     console.log({ message: error });
  //     setErrorToast();
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  // const editPlaylist = async (playlistName: string, playlist: Playlist) => {
  //   try {
  //     setIsFetching(true);
  //     const newPlaylist: Playlist = { ...playlist, name: playlistName };

  //     await mySetDoc({
  //       collection: "playlist",
  //       data: { name: playlistName },
  //       id: newPlaylist.id,
  //       msg: ">>> api: set playlist doc",
  //     });

  //     // updateUserPlaylist({ id: playlist.id, playlist: { name: playlistName } });

  //     setSuccessToast("Playlist edited");
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Error when edit playlist");
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  // const addSongsSongItem = async (song: Song, playlist: Playlist) => {
  //   try {
  //     setIsFetching(true);

  //     const _playlist = await myGetDoc({ collection: "playlist", id: playlist.id });
  //     if (!_playlist.exists()) return;

  //     const _playlistData = _playlist.data() as Playlist;

  //     if (_playlistData.song_ids.includes(song.id)) {
  //       setIsFetching(false);
  //       return;
  //     }

  //     const newSongIds = [..._playlistData.song_ids, song.id];
  //     await mySetDoc({
  //       collection: "playlist",
  //       id: _playlistData.id,
  //       data: { song_ids: newSongIds } as Partial<Playlist>,
  //       msg: ">>> api: update playlist doc",
  //     });
  //   } catch (error) {
  //     console.log({ message: error });
  //     throw new Error("Error when edit playlist");
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  //   _setIsFetching use for song item
  // const removeSong = async (song: Song, _setIsFetching?: (v: boolean) => void) => {
  //   try {
  //     if (!currentPlaylist) return;
  //     _setIsFetching ? _setIsFetching(true) : setIsFetching(true);

  //     const newPlaylistSongs = playlistSongs.filter((s) => s.id !== song.id);

  //     await mySetDoc({
  //       collection: "playlist",
  //       id: currentPlaylist.id,
  //       data: { song_ids: newPlaylistSongs.map((s) => s.id) } as Partial<Playlist>,
  //       msg: ">>> api: update playlist doc",
  //     });

  //     dispatch(setPlaylistSong(newPlaylistSongs));

  //     setSuccessToast(`'${song.name}' removed`);
  //   } catch (error) {
  //     console.log({ message: error });
  //     // setErrorToast("");
  //   } finally {
  //     _setIsFetching ? _setIsFetching(false) : setIsFetching(false);
  //   }
  // };

  const removeSelectSongs = async (
    selectedSongs: Song[],
    _setIsFetching?: (v: boolean) => void,
  ) => {
    try {
      if (!currentPlaylist || !playlistSongs.length) return;

      _setIsFetching ? _setIsFetching(true) : setIsFetching(true);

      const selectedSongIds = selectedSongs.map((s) => s.id);
      const newPlaylistSongs = [...playlistSongs].filter(
        (s) => !selectedSongIds.includes(s.id),
      );
      const newSongIds = newPlaylistSongs.map((s) => s.id);

      await mySetDoc({
        collection: "playlist",
        id: currentPlaylist.id,
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

import { useMemo, useState } from "react";
import {
  selectAllSongStore,
  setPlaylist,
  useAuthStore,
  useSongsStore,
  useToast,
} from "../store";
import { Playlist, Song } from "../types";
import {
  generateId,
  generatePlaylistAfterChangeSong,
  generatePlaylistAfterChangeSongs,
  initPlaylistObject,
  updatePlaylistsValue,
} from "../utils/appHelpers";
import { myDeleteDoc, mySetDoc, setUserPlaylistIdsDoc } from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function usePlaylistActions({ admin }: { admin?: boolean }) {
  const { userInfo } = useAuthStore();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { playlist: playlistInStore } = useSelector(selectAllSongStore);
  const { setErrorToast, setSuccessToast } = useToast();
  const { userPlaylists, setUserPlaylists, adminPlaylists, setAdminPlaylists } =
    useSongsStore();

  const targetPlaylists = useMemo(
    () => (admin ? adminPlaylists : userPlaylists),
    [adminPlaylists, userPlaylists, admin]
  );
  const navigate = useNavigate();

  // closure
  const logger = (type: "error" | "success") => {
    const log = (msg: string) => console.log(`[${type}]: ${msg}`);
    return log;
  };
  const errorLogger = logger("error");

  const setPlaylistDocAndSetContext = async ({
    newPlaylist,
  }: {
    newPlaylist: Playlist;
  }) => {
    
    const newTargetPlaylists = [...targetPlaylists];
    updatePlaylistsValue(newPlaylist, newTargetPlaylists);
    if (!newTargetPlaylists.length) throw new Error("New playlists data error")

    await mySetDoc({
      collection: "playlist",
      data: newPlaylist,
      id: newPlaylist.id,
      msg: ">>> api: set playlist doc",
    });

    console.log('check newPlaylist', newTargetPlaylists);
    

    // *** admin
    if (admin) setAdminPlaylists(newTargetPlaylists);
    // *** user
    else setUserPlaylists(newTargetPlaylists, []);

    // if user playing this playlist, need to update new
    if (playlistInStore.name === newPlaylist.name) {
      console.log('dispatch');
      
      dispatch(setPlaylist(newPlaylist));
    }
  };

  const addPlaylist = async (playlistName: string) => {
    if (admin === undefined && userInfo === undefined) {
      errorLogger("lack of props");
      setErrorToast({ message: "Add playlist error" });
      return;
    }

    if (!playlistName) {
      errorLogger("playlist name invalid");
      setErrorToast({ message: "Add playlist error" });
      return;
    }

    let playlistId = generateId(playlistName);
    if (admin) playlistId += "_admin";

    const addedPlaylist = initPlaylistObject({
      id: playlistId,
      by: admin ? "admin" : userInfo?.email,
      name: playlistName,
    });

    setLoading(true);
    const targetPlaylists = admin ? adminPlaylists : userPlaylists;
    const newPlaylists = [...targetPlaylists, addedPlaylist];

    await mySetDoc({
      collection: "playlist",
      data: addedPlaylist,
      id: playlistId,
      msg: ">>> api: set playlist doc",
    });

    if (admin) {
      setAdminPlaylists(newPlaylists);
    } else {
      await setUserPlaylistIdsDoc(newPlaylists, userInfo);
      setUserPlaylists(newPlaylists, []);
    }
    // *** finish
    setSuccessToast({ message: `'${playlistName}' created` });
  };

  const deletePlaylist = async (playlist: Playlist) => {
    console.log("playlist action deletePlaylist");
    setLoading(true);

    const newTargetPlaylists = targetPlaylists.filter((pl) => pl.id !== playlist.id);

    // >>> local
    if (admin) setAdminPlaylists(newTargetPlaylists);
    else setUserPlaylists(newTargetPlaylists, []);

    // >>> api
    await myDeleteDoc({
      collection: "playlist",
      id: playlist.id,
      msg: ">>> api: delete playlist doc",
    });

    if (!admin) await setUserPlaylistIdsDoc(newTargetPlaylists, userInfo);

    // *** finish
    setLoading(false);
    // reset playlist in store
    const initPlaylist = initPlaylistObject({});
    dispatch(setPlaylist(initPlaylist));

    setSuccessToast({ message: `${playlist.name} deleted` });

    if (admin) navigate("/dashboard");
    else navigate("/mysongs");
  };

  const addSongToPlaylist = async (
    selectSongs: Song[],
    playlistSongs: Song[],
    playList: Playlist
  ) => {
    console.log("playlist action addSongToPlaylist");

    setLoading(true);

    const newPlaylistSongs = [...playlistSongs, ...selectSongs];
    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playList,
    });

    // check valid
    if (
      newPlaylist.count < 0 ||
      newPlaylist.time < 0 ||
      newPlaylist.song_ids.length === playList.song_ids.length
    ) {
      setErrorToast({ message: "New playlist data error" });
      return;
    }

    // handle playlist
    await setPlaylistDocAndSetContext({
      newPlaylist,
    });

    // case modified playlist is a current playlist
    if (playlistInStore.id === newPlaylist.id) {
    }

    // finish
    setLoading(false);
    setSuccessToast({ message: `${selectSongs.length} songs added` });
  };

  const editPlaylist = async (playlistName: string, playlist: Playlist) => {
    try {
      setLoading(true);
      const newPlaylist: Playlist = { ...playlist, name: playlistName };

      await setPlaylistDocAndSetContext({
        newPlaylist,
      });

      setSuccessToast({ message: "Playlist edited" });
    } catch (error) {
      console.log(error);
      throw new Error("Error when edit playlist");
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylistSongItem = async (song: Song, playlist: Playlist) => {
    console.log("playlist action addSongToPlaylist");

    try {
      setLoading(true);

      const newPlaylist = generatePlaylistAfterChangeSong({
        song: song as Song,
        playlist,
      });

      // check valid
      if (
        newPlaylist.count < 0 ||
        newPlaylist.time < 0 ||
        newPlaylist.song_ids.length === playlist.song_ids.length
      ) {
        setErrorToast({ message: "New playlist data error" });
        return;
      }

      // handle playlist
      await setPlaylistDocAndSetContext({ newPlaylist });

      // finish
      setSuccessToast({ message: `${song.name} songs added` });
    } catch (error) {
      console.log(error);
      throw new Error("Error when edit playlist");
    } finally {
      setLoading(false);
    }
  };

  const deleteSongFromPlaylist = async (playlistSongs: Song[], song: Song) => {
    if (!playlistInStore.song_ids) {
      console.log("Wrong playlist data");
      setErrorToast({});
      return;
    }

    console.log("playlist action deleteSongFromPlaylist");
    // setLoading(true);
    const newPlaylistSongs = [...playlistSongs];

    // >>> handle playlist
    // eliminate 1 song
    const index = newPlaylistSongs.findIndex((item) => item.id === song.id);
    newPlaylistSongs.splice(index, 1);

    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    // check valid playlist after change
    if (
      newPlaylist.count < 0 ||
      newPlaylist.time < 0 ||
      newPlaylist.song_ids.length === playlistInStore.song_ids.length
    ) {
      setErrorToast({ message: "New playlist data error" });
      return;
    }

    await setPlaylistDocAndSetContext({
      newPlaylist,
    });

    dispatch(setPlaylist(newPlaylist));

    // >>> finish
    // setLoading(false);
    setSuccessToast({ message: `'${song.name}' removed` });

    return newPlaylistSongs;
  };

  const deleteManyFromPlaylist = async (
    selectedSongList: Song[],
    playlistSongs: Song[]
  ) => {
    console.log("playlist action deleteManyFromPlaylist");
    if (!playlistInStore.song_ids) {
      console.log("Wrong playlist data");
      setErrorToast({});
      return;
    }

    // *** case one song selected
    if (selectedSongList.length === 1) {
      return deleteSongFromPlaylist(playlistSongs, selectedSongList[0]);
    }

    const newPlaylistSongs = [...playlistSongs];

    // *** handle playlist
    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    // check valid playlist data after change
    if (
      newPlaylist.count < 0 ||
      newPlaylist.time < 0 ||
      newPlaylist.song_ids.length === playlistInStore.song_ids.length
    ) {
      setErrorToast({ message: "New playlist data error" });
      throw new Error("New playlist data error");
    }

    setLoading(true);

    await setPlaylistDocAndSetContext({
      newPlaylist,
    });

    dispatch(setPlaylist(newPlaylist));

    // finish
    setLoading(false);
    setSuccessToast({ message: `${selectedSongList.length} songs removed` });

    return newPlaylistSongs;
  };

  return {
    loading,
    addPlaylist,
    editPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    deleteManyFromPlaylist,
    deleteSongFromPlaylist,
    addSongToPlaylistSongItem,
  };
}

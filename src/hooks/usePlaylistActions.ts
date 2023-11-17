import { useState } from "react";
import {
  selectAllSongStore,
  setPlaylist,
  useAuthStore,
  useSongsStore,
  useToast,
} from "../store";
import { Playlist, Song } from "../types";
import {
  countSongsListTimeIds,
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

  // const targetPlaylists = useMemo(
  //    () => (admin ? adminPlaylists : userPlaylists),
  //    [adminPlaylists, userPlaylists, admin]
  // );
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
    const isAdmin = newPlaylist.by === "admin";
    const newTargetPlaylists = isAdmin ? [...adminPlaylists] : [...userPlaylists];

    updatePlaylistsValue(newPlaylist, newTargetPlaylists);
    if (!newTargetPlaylists.length) throw new Error("New playlists data error");

    await mySetDoc({
      collection: "playlist",
      data: newPlaylist,
      id: newPlaylist.id,
      msg: ">>> api: set playlist doc",
    });

    console.log("check newPlaylist", newTargetPlaylists);

    // *** admin
    if (admin) setAdminPlaylists(newTargetPlaylists);
    // *** user
    else setUserPlaylists(newTargetPlaylists, []);

    // if user playing this playlist, need to update new
    if (playlistInStore.name === newPlaylist.name) {
      console.log("dispatch");

      dispatch(setPlaylist(newPlaylist));
    }
  };

  const addPlaylist = async (playlistName: string) => {
    if (admin === undefined && userInfo === undefined) {
      errorLogger("lack of props");
      setErrorToast({ message: "Add playlist error" });
      throw new Error("lack of props");
    }

    if (!playlistName) {
      errorLogger("playlist name invalid");
      setErrorToast({ message: "Add playlist error" });
      throw new Error("playlist name invalid");
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
  };

  const deletePlaylist = async (playlist: Playlist) => {
    console.log("playlist action deletePlaylist");
    setLoading(true);

    // >>> api
    await myDeleteDoc({
      collection: "playlist",
      id: playlist.id,
      msg: ">>> api: delete playlist doc",
    });

    let newUserPlaylist: Playlist[] = [];
    // *** admin
    if (admin) {
      const newPlaylists = adminPlaylists.filter((pl) => pl.id !== playlist.id);
      setAdminPlaylists(newPlaylists);
    }
    // *** user
    else {
      newUserPlaylist = userPlaylists.filter((pl) => pl.id !== playlist.id);
      setUserPlaylists(newUserPlaylist, []);
    }

    if (!admin) await setUserPlaylistIdsDoc(newUserPlaylist, userInfo);

    // *** finish
    setLoading(false);
    // reset playlist in store
    const initPlaylist = initPlaylistObject({});
    dispatch(setPlaylist(initPlaylist));

    setSuccessToast({ message: `${playlist.name} deleted` });

    if (admin) navigate("/dashboard");
    else navigate("/mysongs");
  };

  // before (playlistSongs, selectedSongs)

  const addSongsToPlaylist = async (selectSongs: Song[], playList: Playlist) => {
    console.log("playlist action addSongToPlaylist");

    setLoading(true);

    const { ids, time } = countSongsListTimeIds(selectSongs);

    const newPlaylistSongIds = [...playList.song_ids, ...ids];

    const newPlaylist: Playlist = {
      ...playList,
      song_ids: newPlaylistSongIds,
      time: playList.time + time,
      count: newPlaylistSongIds.length,
    };

    // check valid
    if (newPlaylist.song_ids.length <= playList.song_ids.length) {
      setErrorToast({ message: "New playlist data error" });
      throw new Error("New playlist data error");
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

      dispatch(setPlaylist(newPlaylist));

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
        newPlaylist.time <= playlist.time ||
        newPlaylist.song_ids.length <= playlist.song_ids.length
      ) {
        setErrorToast({ message: "New playlist data error" });
        throw new Error("New playlist data error");
      }

      await setPlaylistDocAndSetContext({ newPlaylist });
    } catch (error) {
      console.log(error);
      throw new Error("Error when edit playlist");
    } finally {
      setLoading(false);
    }
  };

  const deleteSongFromPlaylist = async (song: Song, playlistSongs: Song[]) => {
    if (!playlistInStore.song_ids) {
      setErrorToast({});
      throw new Error("Wrong playlist data");
    }

    console.log("playlist action deleteSongFromPlaylist");
    // setLoading(true);
    const newPlaylistSongs = [...playlistSongs];

    // >>> handle playlist
    // eliminate 1 song
    const index = newPlaylistSongs.findIndex((item) => item.id === song.id);
    newPlaylistSongs.splice(index, 1);

    const newPlaylist = generatePlaylistAfterChangeSongs({
      songs: newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    // check valid playlist after change
    if (
      newPlaylist.count < 0 ||
      newPlaylist.time < 0 ||
      newPlaylist.song_ids.length === playlistInStore.song_ids.length
    ) {
      setErrorToast({ message: "New playlist data error" });
      throw new Error("New playlist data error");
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
      throw new Error("Wrong playlist data");
    }

    // *** case one song selected
    if (selectedSongList.length === 1) {
      return deleteSongFromPlaylist(selectedSongList[0], playlistSongs);
    }

    const newPlaylistSongs = [...playlistSongs];

    for (let song of selectedSongList) {
      const index = newPlaylistSongs.indexOf(song);
      newPlaylistSongs.splice(index, 1);
    }

    // *** handle playlist
    const newPlaylist = generatePlaylistAfterChangeSongs({
      songs: newPlaylistSongs,
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
    addSongsToPlaylist,
    deleteManyFromPlaylist,
    deleteSongFromPlaylist,
    addSongToPlaylistSongItem,
    setPlaylistDocAndSetContext,
  };
}

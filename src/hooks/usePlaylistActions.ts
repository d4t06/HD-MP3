import { useState } from "react";
import {
   selectAllSongStore,
   setPlaylist,
   useAuthStore,
   useSongsStore,
   useToast,
} from "../store";
import { Playlist, Song, User } from "../types";
import {
   generateId,
   generatePlaylistAfterChangeSongs,
   initPlaylistObject,
   updatePlaylistsValue,
   updateSongsListValue,
} from "../utils/appHelpers";
import { myDeleteDoc, mySetDoc, setUserPlaylistIdsDoc } from "../utils/firebaseHelpers";
import {
   handleSongWhenAddToPlaylist,
   handleSongWhenDeleteFromPlaylist,
   handleSongWhenDeletePlaylist,
} from "../utils/songItemHelper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

export default function usePlaylistActions({ admin }: { admin?: boolean }) {
   const { userInfo } = useAuthStore();
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);
   const { setErrorToast, setSuccessToast } = useToast();
   const { userPlaylists, setUserPlaylists } = useSongsStore();

   const navigate = useNavigate();

   // closure
   const logger = (type: "error" | "success") => {
      const log = (msg: string) => console.log(`[${type}]: ${msg}`);
      return log;
   };
   const errorLogger = logger("error");

   const addPlaylist = async (playlistName: string) => {
      if (admin === undefined && userInfo === undefined) {
         errorLogger("lack of props");
         setErrorToast({ message: "Add playlist error" });

         return;
      }

      if (!playlistName) {
         return;
      }

      const idExtend = admin
         ? "_admin"
         : "_" + (userInfo?.email.replace("@gmail.com", "") as string);
      if (!idExtend) {
         errorLogger("id error");
         setErrorToast({ message: "Add playlist error" });

         return;
      }

      const playlistId = generateId(playlistName) + idExtend;

      const addedPlaylist: Playlist = {
         id: playlistId,
         image_by: "",
         image_file_path: "",
         image_url: "",
         by: userInfo?.email || "users",
         name: playlistName,
         song_ids: [],
         count: 0,
         time: 0,
         blurhash_encode: "",
      };

      // insert new playlist to users playlist

      setLoading(true);

      // *** case admin
      // need to fetch new data after done
      if (admin) {
         // >>> api
         await mySetDoc({
            collection: "playlist",
            data: addedPlaylist,
            id: playlistId,
            msg: ">>> api: add playlist doc",
         });

         setLoading(false);
         return;
      }

      // *** case normal user
      const newPlaylists = [...userPlaylists, addedPlaylist];
      // >>> local
      setUserPlaylists(newPlaylists, []);
      // >>> api
      await mySetDoc({ collection: "playlist", data: addedPlaylist, id: playlistId });
      await setUserPlaylistIdsDoc(newPlaylists, userInfo as User);

      // *** finish
      setSuccessToast({ message: `'${playlistName}' created` });
   };

   const deletePlaylist = async (playlist: Playlist, playlistSongs: Song[]) => {
      // handle song
      // let newUserSongs: Song[] = [];
      // let songsResult: Song[] = [];
      // if (playlistSongs.length) {
      //    newUserSongs = [...userSongs];
      //    const { error, songsNeedToUpdate } = handleSongWhenDeletePlaylist(
      //       playlist,
      //       playlistSongs
      //    );

      //    if (error) {
      //       errorLogger("song error when handle delete playlist");
      //       setErrorToast({});
      //       throw new Error("Song error when handle delete playlist");
      //    }

      //    songsResult = songsNeedToUpdate;
      // }
      // if (songsResult.length) {
      //    // update each song
      //    for (let song of songsResult) {
      //       updateSongsListValue(song, newUserSongs);
      //       // >>> api
      //       await mySetDoc({ collection: "songs", data: song, id: song.id });
      //    }
      // }
      setLoading(true);

      // *** case admin
      if (admin) {
         await myDeleteDoc({
            collection: "playlist",
            id: playlist.id,
            msg: ">>> api: delete playlist doc",
         });
         setLoading(false);
         setSuccessToast({ message: `${playlist.name} deleted` });

         return;
      }

      // *** case user
      // eliminate 1 playlist
      const newUserPlaylists = userPlaylists.filter((pl) => pl.id !== playlist.id);

      // >>> local
      setUserPlaylists(newUserPlaylists, []);
      // *** case playlist have song
      // if (songsResult.length) {
      //    setUserSongs(newUserSongs);
      // }

      // >>> api
      await myDeleteDoc({
         collection: "playlist",
         id: playlist.id,
         msg: ">>> api: delete playlist doc",
      });
      await setUserPlaylistIdsDoc(newUserPlaylists, userInfo);

      // *** finish
      setLoading(false);
      // reset playlist in store
      const initPlaylist = initPlaylistObject({});
      dispatch(setPlaylist(initPlaylist));

      setSuccessToast({ message: `${playlist.name} deleted` });

      navigate(routes.MySongs);
   };

   const setPlaylistDocAndSetUserPlaylists = async ({
      newPlaylist,
   }: {
      newPlaylist: Playlist;
   }) => {
      // update userPlaylist
      const newUserPlaylists = [...userPlaylists];
      updatePlaylistsValue(newPlaylist, newUserPlaylists);

      // if user playing this playlist, need to update new
      if (playlistInStore.name === newPlaylist.name) {
         dispatch(setPlaylist(newPlaylist));
      }
      await mySetDoc({ collection: "playlist", data: newPlaylist, id: newPlaylist.id });

      setUserPlaylists(newUserPlaylists, []);
   };

   const addSongToPlaylist = async (selectSongs: Song[], playlistSongs: Song[], playList: Playlist) => {
      const newPlaylistSongs = [...playlistSongs, ...selectSongs];

      // >>> handle song
      // const newUserSongs = [...userSongs];
      // const songsNeedToUpdateDoc: Song[] = [];
      // for (let song of selectSongs) {
      //    const { error, newSong } = handleSongWhenAddToPlaylist(song, playlistInStore);

      //    if (error) {
      //       setErrorToast({ message: "handleSongWhenDeleteFromPlaylist error" });
      //       return;
      //    } else if (newSong) {
      //       songsNeedToUpdateDoc.push(newSong);
      //       updateSongsListValue(newSong, newUserSongs);
      //    }
      // }

      // handle playlist
      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playList,
      });

      console.log('select', selectSongs.map(s => s.name, newPlaylist));
      

      // check valid
      if (
         newPlaylist.count < 0 ||
         newPlaylist.time < 0 ||
         newPlaylist.song_ids.length === playList.song_ids.length
      ) {
         setErrorToast({ message: "New playlist data error" });
         return;
      }

      setLoading(true);

      // *** case admin
      if (admin) {
         await mySetDoc({
            collection: "playlist",
            data: newPlaylist,
            id: newPlaylist.id,
         });
         setSuccessToast({ message: `${selectSongs.length} songs added` });
         setLoading(false);

         return;
      }

      // *** case user
      // handle song
      // setUserSongs(newUserSongs);
      // songsNeedToUpdateDoc.forEach(async (song) => {
      //    await mySetDoc({ collection: "songs", data: song, id: song.id });
      // });

      // handle playlist
      await setPlaylistDocAndSetUserPlaylists({
         newPlaylist,
      });

      // finish
      setLoading(true);
      setSuccessToast({ message: `${selectSongs.length} songs added` });
   };

   const deleteSongFromPlaylist = async (playlistSongs: Song[], song: Song) => {
      if (!playlistInStore.song_ids) {
         console.log("Wrong playlist data");
         setErrorToast({});
         return;
      }

      const newPlaylistSongs = [...playlistSongs];

      // >>> handle song
      // const newUserSongs = [...userSongs];
      // const { error, newSong } = handleSongWhenDeleteFromPlaylist(song, playlistInStore);

      // if (error || !newSong) {
      //    setErrorToast({ message: "Handle song when delete from playlist error" });
      //    return;
      // }
      // updateSongsListValue(newSong, newUserSongs);

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

      setLoading(true);

      // *** case admin
      if (admin) {
         await mySetDoc({
            collection: "playlist",
            data: newPlaylist,
            id: newPlaylist.id,
         });
         setLoading(false);

         setSuccessToast({ message: `'${song.name}' removed` });

         return;
      }

      // *** case user
      // >>> local
      // setUserSongs(newUserSongs);

      // >>> api
      // await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });
      await setPlaylistDocAndSetUserPlaylists({
         newPlaylist,
      });
      // >>> finish
      setLoading(false);
      setSuccessToast({ message: `'${song.name}' removed` });
   };

   const deleteManyFromPlaylist = async (
      selectedSongList: Song[],
      playlistSongs: Song[]
   ) => {
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

      // *** handle song
      // const songsNeedToUpdateDoc: Song[] = [];
      // const newUserSongs = [...userSongs];
      // for (let song of selectedSongList) {
      //    // eliminate 1 song
      //    const index = newPlaylistSongs.findIndex((item) => item.id === song.id);
      //    newPlaylistSongs.splice(index, 1);

      //    const { error, newSong } = handleSongWhenDeleteFromPlaylist(
      //       song,
      //       playlistInStore
      //    );

      //    // update user songs
      //    if (error) {
      //       setErrorToast({ message: "handleSongWhenDeleteFromPlaylist error" });
      //    } else if (newSong) {
      //       if (!admin) {
      //          songsNeedToUpdateDoc.push(newSong);
      //          updateSongsListValue(newSong, newUserSongs);
      //       }
      //    }
      // }

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

      if (admin) {
         await mySetDoc({
            collection: "playlist",
            data: newPlaylist,
            id: newPlaylist.id,
         });
         setLoading(false);
         setSuccessToast({ message: `'${selectedSongList.length} song removed` });

         return;
      }
      // >>> local
      // setUserSongs(newUserSongs);
      // // >>> api
      // songsNeedToUpdateDoc.forEach(async (song) => {
      //    console.log("update doc", song.name);
      //    // await mySetDoc({ collection: "songs", data: song, id: song.id });
      // });

      await setPlaylistDocAndSetUserPlaylists({
         newPlaylist,
      });

      // finish
      setLoading(false);
      setSuccessToast({ message: `${selectedSongList.length} songs removed` });
   };

   return {
      loading,
      addPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      deleteManyFromPlaylist,
      deleteSongFromPlaylist,
   };
}

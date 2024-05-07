import { useState } from "react";
import {
   selectAllSongStore,
   setPlaylist,
   useSongsStore,
   useToast,
} from "../store";
import {
   countSongsListTimeIds,
   generateId,
   generatePlaylistAfterChangeSong,
   generatePlaylistAfterChangeSongs,
   initPlaylistObject,
   updatePlaylistsValue,
} from "../utils/appHelpers";
import { myDeleteDoc, mySetDoc } from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useAdminPlaylistActions() {
   // store
   const dispatch = useDispatch();
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);
   const { setAdminPlaylists, adminPlaylists } = useSongsStore();

   // state
   const [isFetching, setIsFetching] = useState(false);

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();
   const navigate = useNavigate();

   const setPlaylistDocAndSetContext = async ({
      newPlaylist,
   }: {
      newPlaylist: Playlist;
   }) => {
      const newTargetPlaylists = [...adminPlaylists];

      updatePlaylistsValue(newPlaylist, newTargetPlaylists);
      if (!newTargetPlaylists.length) throw new Error("New playlists data error");

      await mySetDoc({
         collection: "playlist",
         data: newPlaylist,
         id: newPlaylist.id,
         msg: ">>> api: set playlist doc",
      });

      setAdminPlaylists(newTargetPlaylists);

      // if user playing this playlist, need to update new
      if (playlistInStore.name === newPlaylist.name) {
         dispatch(setPlaylist(newPlaylist));
      }
   };

   const addAdminPlaylist = async (playlistName: string) => {
      if (!playlistName) throw new Error("playlist name invalid");

      const playlistId = generateId(playlistName) + "_admin";

      const addedPlaylist = initPlaylistObject({
         id: playlistId,
         by: "admin",
         name: playlistName,
      });

      setIsFetching(true);
      const newPlaylists = [...adminPlaylists, addedPlaylist];

      setAdminPlaylists(newPlaylists);
      await mySetDoc({
         collection: "playlist",
         data: addedPlaylist,
         id: playlistId,
         msg: ">>> api: set playlist doc",
      });
   };

   const deleteAdminPlaylist = async (playlist: Playlist) => {
      setIsFetching(true);

      // >>> api
      await myDeleteDoc({
         collection: "playlist",
         id: playlist.id,
         msg: ">>> api: delete playlist doc",
      });

      const newPlaylists = adminPlaylists.filter((p) => p.id !== playlist.id);
      setAdminPlaylists(newPlaylists);

      // *** finish
      setIsFetching(false);

      // reset playlist in store
      const initPlaylist = initPlaylistObject({});
      dispatch(setPlaylist(initPlaylist));

      setSuccessToast({ message: `${playlist.name} deleted` });

      navigate("/dashboard");
   };

   // before (playlistSongs, selectedSongs)
   const addSongsToAdminPlaylist = async (selectSongs: Song[], playList: Playlist) => {
      setIsFetching(true);

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
      //   if (playlistInStore.id === newPlaylist.id) {
      //   }

      // finish
      setIsFetching(false);
      setSuccessToast({ message: `${selectSongs.length} songs added` });
   };

   const editAdminPlaylist = async (playlistName: string, playlist: Playlist) => {
      try {
         setIsFetching(true);
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
         setIsFetching(false);
      }
   };

   const addSongToAdminPlaylistSongItem = async (song: Song, playlist: Playlist) => {
      //   console.log("playlist action addSongToPlaylist");

      try {
         setIsFetching(true);

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
         setIsFetching(false);
      }
   };

   const deleteSongFromAdminPlaylist = async (song: Song, playlistSongs: Song[]) => {
      if (!playlistInStore.song_ids) throw new Error("Wrong playlist data");

      //   console.log("playlist action deleteSongFromPlaylist");
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

      setIsFetching(true);

      await setPlaylistDocAndSetContext({
         newPlaylist,
      });

      dispatch(setPlaylist(newPlaylist));

      // >>> finish
      setIsFetching(false);
      setSuccessToast({ message: `'${song.name}' removed` });

      return newPlaylistSongs;
   };

   const deleteManyFromAdminPlaylist = async (
      selectedSongList: Song[],
      playlistSongs: Song[]
   ) => {
      console.log("playlist action deleteManyFromPlaylist");
      if (!playlistInStore.song_ids) throw new Error("Wrong playlist data");

      // *** case one song selected
      if (selectedSongList.length === 1) {
         return deleteSongFromAdminPlaylist(selectedSongList[0], playlistSongs);
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

      setIsFetching(true);

      await setPlaylistDocAndSetContext({
         newPlaylist,
      });

      dispatch(setPlaylist(newPlaylist));

      // finish
      setIsFetching(false);
      setSuccessToast({ message: `${selectedSongList.length} songs removed` });

      return newPlaylistSongs;
   };

   return {
      isFetching,
      addAdminPlaylist,
      editAdminPlaylist,
      deleteAdminPlaylist,
      addSongsToAdminPlaylist,
      deleteManyFromAdminPlaylist,
      deleteSongFromAdminPlaylist,
      addSongToAdminPlaylistSongItem,
      setPlaylistDocAndSetContext,
   };
}

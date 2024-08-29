import { useState } from "react";
import { useAuthStore, useSongsStore, useToast } from "../store";
import { generateId, initPlaylistObject } from "../utils/appHelpers";
import {
   myDeleteDoc,
   mySetDoc,
   setUserPlaylistIdsDoc,
} from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
   addSongsAndUpdateCurrent,
   resetCurrentPlaylist,
   selectCurrentPlaylist,
   setCurrentPlaylist,
   setPlaylistSongsAndUpdateCurrent,
   updateCurrentPlaylist,
} from "@/store/currentPlaylistSlice";
import { resetCurrentSong, selectCurrentSong } from "@/store/currentSongSlice";
import { addSongToQueue } from "@/store/songQueueSlice";

export default function usePlaylistActions() {
   // store
   const dispatch = useDispatch();
   const { user } = useAuthStore();
   const { currentPlaylist, playlistSongs } = useSelector(
      selectCurrentPlaylist
   );
   const { currentSong } = useSelector(selectCurrentSong);
   const { userPlaylists, updateUserPlaylist, setUserPlaylists } =
      useSongsStore();

   // state
   const [isFetching, setIsFetching] = useState(false);

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();
   const navigate = useNavigate();

   const setPlaylistDocAndUpdateUserPlaylist = async (
      newPlaylist: Playlist
   ) => {
      await mySetDoc({
         collection: "playlist",
         data: newPlaylist,
         id: newPlaylist.id,
         msg: ">>> api: set playlist doc",
      });

      updateUserPlaylist(newPlaylist);
   };

   const addPlaylist = async (playlistName: string) => {
      if (!user) throw new Error("user not found");
      if (!playlistName) throw new Error("playlist name invalid");

      const playlistId = generateId(playlistName);

      const addedPlaylist = initPlaylistObject({
         id: playlistId,
         by: user.email,
         name: playlistName,
      });

      setIsFetching(true);
      const newPlaylists = [...userPlaylists, addedPlaylist];

      await mySetDoc({
         collection: "playlist",
         data: addedPlaylist,
         id: playlistId,
         msg: ">>> api: set playlist doc",
      });
      await setUserPlaylistIdsDoc(newPlaylists, user);

      setUserPlaylists(newPlaylists);
      setIsFetching(false);
   };

   const deletePlaylist = async () => {
      if (!user) return;

      setIsFetching(true);
      const newUserPlaylist = userPlaylists.filter(
         (pl) => pl.id !== currentPlaylist.id
      );

      await myDeleteDoc({
         collection: "playlist",
         id: currentPlaylist.id,
         msg: ">>> api: delete playlist doc",
      });

      await setUserPlaylistIdsDoc(newUserPlaylist, user);

      setUserPlaylists(newUserPlaylist);
      dispatch(resetCurrentPlaylist());

      if (currentSong.song_in === `playlist_${currentPlaylist.id}`)
         dispatch(resetCurrentSong());

      setIsFetching(false);
      navigate("/mysongs");
   };

   // before (playlistSongs, selectedSongs)
   const addSongsToPlaylist = async (selectSongs: Song[]) => {
      setIsFetching(true);

      const newPlaylist = { ...currentPlaylist };

      newPlaylist.song_ids = [
         ...currentPlaylist.song_ids,
         ...selectSongs.map((s) => s.id),
      ];

      await setPlaylistDocAndUpdateUserPlaylist(newPlaylist);

      console.log(">>> playlist songs", playlistSongs.length);

      dispatch(addSongsAndUpdateCurrent({ songs: selectSongs }));

      if (currentSong.song_in === `playlist_${currentPlaylist.id}`) {
         const newSongs = selectSongs.map(
            (s) => ({ ...s, song_in: `playlist_${currentPlaylist.id}` } as Song)
         );
         dispatch(addSongToQueue({ songs: newSongs }));
      }

      setIsFetching(false);
      setSuccessToast({ message: `${selectSongs.length} songs added` });
   };

   const editPlaylist = async (playlistName: string, playlist: Playlist) => {
      try {
         setIsFetching(true);
         const newPlaylist: Playlist = { ...playlist, name: playlistName };

         await setPlaylistDocAndUpdateUserPlaylist(newPlaylist);

         dispatch(updateCurrentPlaylist(newPlaylist));

         setSuccessToast({ message: "Playlist edited" });
      } catch (error) {
         console.log(error);
         throw new Error("Error when edit playlist");
      } finally {
         setIsFetching(false);
      }
   };

   const addSongToPlaylistSongItem = async (song: Song, playlist: Playlist) => {
      try {
         setIsFetching(true);

         const newSongIds = [...playlist.song_ids, song.id];

         const newPlaylist = { ...playlist };
         newPlaylist.song_ids = newSongIds;

         if (playlist.id === currentPlaylist.id) {
            dispatch(updateCurrentPlaylist({ song_ids: newSongIds }));
         }

         await setPlaylistDocAndUpdateUserPlaylist(newPlaylist);
      } catch (error) {
         console.log({ message: error });
         throw new Error("Error when edit playlist");
      } finally {
         setIsFetching(false);
      }
   };

   const deleteSongFromPlaylist = async (song: Song) => {
      setIsFetching(true);
      const newPlaylistSongs = playlistSongs.filter((s) => s.id !== song.id);

      console.log(
         "delete songs",
         playlistSongs.map((s) => s.id),
         newPlaylistSongs.map((s) => s.id)
      );

      const newPlaylist = { ...currentPlaylist };
      newPlaylist.song_ids = newPlaylistSongs.map((s) => s.id);

      await setPlaylistDocAndUpdateUserPlaylist(newPlaylist);

      dispatch(setPlaylistSongsAndUpdateCurrent({ songs: newPlaylistSongs }));

      // >>> finish
      setIsFetching(false);
      setSuccessToast({ message: `'${song.name}' removed` });
   };

   const deleteSongsFromPlaylist = async (selectedSongs: Song[]) => {
      console.log("playlist action deleteManyFromPlaylist");
      if (!currentPlaylist.song_ids) {
         console.log("Wrong playlist data");
         setErrorToast({});
         throw new Error("Wrong playlist data");
      }

      // *** case one song selected
      if (selectedSongs.length === 1) {
         return deleteSongFromPlaylist(selectedSongs[0]);
      }

      const selectedSongIds = selectedSongs.map((s) => s.id);

      const newPlaylistSongs = playlistSongs.filter(
         (s) => !selectedSongIds.includes(s.id)
      );

      // *** handle playlist
      const newPlaylist = { ...currentPlaylist };
      newPlaylist.song_ids = newPlaylistSongs.map((s) => s.id);

      setIsFetching(true);

      await setPlaylistDocAndUpdateUserPlaylist(newPlaylist);

      dispatch(setPlaylistSongsAndUpdateCurrent({ songs: newPlaylistSongs }));

      // finish
      setIsFetching(false);
      setSuccessToast({ message: `${selectedSongs.length} songs removed` });

      return newPlaylistSongs;
   };

   return {
      isFetching,
      addPlaylist,
      editPlaylist,
      deletePlaylist,
      addSongsToPlaylist,
      deleteSongsFromPlaylist,
      deleteSongFromPlaylist,
      addSongToPlaylistSongItem,
      setPlaylistDocAndUpdateUserPlaylist,
   };
}

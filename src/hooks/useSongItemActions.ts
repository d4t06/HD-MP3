import { useDispatch, useSelector } from "react-redux";
import { useSongsStore } from "../store/SongsContext";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist, Song } from "../types";
import { updatePlaylistsValue } from "../utils/appHelpers";
import { useCallback } from "react";

const useSongItemActions = () => {
   const dispatch = useDispatch();
   const { userPlaylists, setUserPlaylists, userSongs, setUserSongs } = useSongsStore();
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);

   const setPlaylistDocAndSetUserPlaylists = useCallback(
      async ({ newPlaylist }: { newPlaylist: Playlist }) => {
         // update userPlaylist
         const newUserPlaylists = [...userPlaylists];
         updatePlaylistsValue(newPlaylist, newUserPlaylists);

         // if user playing this playlist, need to update new
         if (playlistInStore.name === newPlaylist.name) {
            dispatch(setPlaylist(newPlaylist));
         }

         setUserPlaylists(newUserPlaylists, []);

         // try {
         //    await setPlaylistDoc({ playlist: newPlaylist });
         // } catch (error) {
         //    console.log(error);
         //    setErrorToast({});
         // }
      },
      [userPlaylists, playlistInStore]
   );

   const updateAndSetUserSongs = useCallback(
      async ({ song }: { song: Song }) => {
         // reference copy newUserSongIds = userSongIds;
         let newUserSongs = [...userSongs];

         // eliminate 1 song
         const index = newUserSongs.indexOf(song);
         newUserSongs.splice(index, 1);

         const newUserSongIds = newUserSongs.map((songItem) => songItem.id);

         setUserSongs(newUserSongs);

         return newUserSongIds;
      },
      [userSongs]
   );

   
   return { setPlaylistDocAndSetUserPlaylists, updateAndSetUserSongs };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

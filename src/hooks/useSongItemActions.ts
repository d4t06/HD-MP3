import { useDispatch, useSelector } from "react-redux";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist, Song } from "../types";
import { setPlaylistDoc } from "../utils/firebaseHelpers";
import { updatePlaylistsValue } from "../utils/appHelpers";
import { useCallback } from "react";

const useSongItemActions = () => {
   const dispatch = useDispatch();
   const { setErrorToast } = useToast();
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

         try {
            await setPlaylistDoc({ playlist: newPlaylist });
         } catch (error) {
            console.log(error);
            setErrorToast({});
         }
      },
      [userPlaylists, playlistInStore]
   );

   const updateAndSetUserSongs = useCallback(
      async ({ song }: { song: Song }) => {
         // reference copy newUserSongIds = userSongIds;
         // const newUserSongIds = [...userSongIds];
         let newUserSongs = [...userSongs];

         console.log('check prev usersongs', newUserSongs.map(song => song.name));
         

         // get index of deleted song in userSongs
         const index = newUserSongs.indexOf(song);
         newUserSongs.splice(index, 1);
         // console.log('delete index', song.name, index + 1);
         

         const newUserSongIds = newUserSongs.map((songItem) => songItem.id);

         console.log('current', newUserSongs.map(song => song.name));
         // update user songs
         setUserSongs(newUserSongs);

         return newUserSongIds;
      },
      [userSongs]
   );

   console.log('use songitem action render, check user songs', userSongs);
   

   return { setPlaylistDocAndSetUserPlaylists, updateAndSetUserSongs };
}


export default useSongItemActions
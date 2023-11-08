import { useDispatch, useSelector } from "react-redux";
import { useSongsStore } from "../store/SongsContext";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist, Song } from "../types";
import { updatePlaylistsValue } from "../utils/appHelpers";
import { useCallback } from "react";
import { mySetDoc } from "../utils/firebaseHelpers";

const useSongItemActions = () => {
   const dispatch = useDispatch();
   const { userPlaylists, setUserPlaylists, userSongs, setUserSongs } = useSongsStore();
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);

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

   
   return {updateAndSetUserSongs };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

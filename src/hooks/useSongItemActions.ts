import { useDispatch, useSelector } from "react-redux";
import { useSongsStore } from "../store/SongsContext";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist, Song } from "../types";
import {
   updatePlaylistDoc,
   updatePlaylistsValue,
} from "../utils/firebaseHelpers";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";

export default function useSongItemActions() {
   const dispatch = useDispatch();

   const { setToasts } = useToast();

   const { userPlaylists, setUserPlaylists, userSongs, setUserSongs } =
      useSongsStore();
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);

   const updatePlaylistAfterChange = async ({
      newPlaylist,
   }: {
      newPlaylist: Playlist;
   }) => {
      // update userPlaylist
      const newUserPlaylists = [...userPlaylists];
      updatePlaylistsValue(newPlaylist, newUserPlaylists);

      // if user playing this playlist, need to update new value
      
      if (playlistInStore.name === newPlaylist.name) {
         dispatch(setPlaylist(newPlaylist));
      }

      setUserPlaylists(newUserPlaylists, []);

      try {
         await updatePlaylistDoc({ playlist: newPlaylist });
      } catch (error) {
         console.log(error);
         setToasts((t) => [
            ...t,
            {
               title: "error",
               id: nanoid(4),
               desc: `Something went wrong`,
            },
         ]);
      }
   };

   const updateSongsListAfterChange = async ({ song }: { song: Song }) => {

      // reference copy newUserSongIds = userSongIds;
      // const newUserSongIds = [...userSongIds];
      const newUserSongs = [...userSongs];

      // get index of deleted song in userSongs
      const index = newUserSongs.indexOf(song);
      newUserSongs.splice(index, 1);

      const newUserSongIds = newUserSongs.map((songItem) => songItem.id);

      // update user songs
      setUserSongs(newUserSongs);

      return newUserSongIds
      // update user doc
      // await setUserSongIdsAndCountDoc(newUserSongIds, userData);
   };

   return { updatePlaylistAfterChange, updateSongsListAfterChange };
}

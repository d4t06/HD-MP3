import { useSongsStore } from "../store/SongsContext";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import {
   selectAllSongStore,
   setSong,
   useActuallySongsStore,
   useAuthStore,
   useToast,
} from "../store";
import { deleteSong, mySetDoc } from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import { initSongObject } from "../utils/appHelpers";
import usePlaylistActions from "./usePlaylistActions";
import { usePlaylistContext } from "../store/PlaylistSongContext";

const useSongItemActions = ({
   song,
   admin = false,
   closeModal,
   setIsOpenPopup,
}: {
   song: Song;
   admin?: boolean;
   closeModal: () => void;
   setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
}) => {
   const dispatch = useDispatch();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { setErrorToast, setSuccessToast } = useToast();
   const { user } = useAuthStore();
   const { removeFromQueue } = useActuallySongsStore();
   const { userSongs, setUserSongs, adminSongs, setAdminSongs } = useSongsStore();
   const { playlistSongs, setPlaylistSongs } = usePlaylistContext();

   const { addSongToPlaylistSongItem, deleteSongFromPlaylist } = usePlaylistActions();

   const songs = useMemo(() => (admin ? adminSongs : userSongs), [adminSongs, userSongs]);
   const setSongs = useMemo(() => (admin ? setAdminSongs : setUserSongs), []);

   const [loading, setLoading] = useState(false);

   // closure
   const logger = (type: "error" | "success") => {
      const log = (msg: string) => console.log(`[${type}]: ${msg}`);
      return log;
   };
   // const errorLogger = logger("error");
   const successLogger = logger("success");

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

   // must use middle variable 'song' to add to playlist in mobile device
   const handleAddSongToPlaylistMobile = async (playlist: Playlist) => {
      try {
         setLoading(true);
         await addSongToPlaylistSongItem(song, playlist);
         setSuccessToast({
            message: `'${song.name}' added to '${playlist.name}'`,
         });
      } catch (error) {
         console.log(error);
         throw new Error("Error when add song to playlist");
      } finally {
         setLoading(false);
         closeModal();
      }
   };

   const handleDeleteSong = async () => {
      try {
         setLoading(true);
         let newSongs = [...songs];

         const index = newSongs.indexOf(song);
         newSongs.splice(index, 1);

         const newUserSongIds = newSongs.map((songItem) => songItem.id);
         await deleteSong(song);

         // not for admin
         if (!admin) {
            if (!user) return;
            await mySetDoc({
               collection: "users",
               data: {
                  song_ids: newUserSongIds,
                  song_count: newUserSongIds.length,
               } as Partial<User>,
               id: user.email,
               msg: `>>> api: update user doc ${user.email}`,
            });
         }

         setSongs(newSongs);

         if (admin || songInStore.song_in === "user") {
            removeFromQueue(song);
         }

         if (!admin) {
            if (!user) return;
            if (user.like_song_ids.includes(song.id)) {
               const newUserLikeSongIds = user.like_song_ids.filter(
                  (id) => id !== song.id
               );
               // setUser({ like_song_ids: newUserLikeSongIds });
            }
         }

         // >>> finish
         if (songInStore.id === song.id) {
            const emptySong = initSongObject({});
            dispatch(setSong({ ...emptySong, song_in: "", currentIndex: 0 }));
         }
         successLogger("delete song completed");
         setSuccessToast({ message: `'${song.name}' deleted` });
      } catch (error) {
         console.log({ message: error });
         throw new Error("Error when delete song");
      } finally {
         setLoading(false);
         closeModal();
      }
   };

   const handleAddSongToPlaylist = async (playlist: Playlist) => {
      if (!song || !playlist) {
         setErrorToast({ message: "Lack of props" });
         return;
      }
      try {
         setLoading(true);
         await addSongToPlaylistSongItem(song, playlist);
         setSuccessToast({
            message: `'${song.name}' added to '${playlist.name}'`,
         });
      } catch (error) {
         console.log(error);
         throw new Error("Error when add song to playlist");
      } finally {
         setLoading(false);
         setIsOpenPopup(false);
      }
   };

   const handleRemoveSongFromPlaylist = async () => {
      try {
         setLoading(true);
         if (!playlistSongs.length) throw Error("Error when remove song from playlist");
         const newPlaylistSongs = await deleteSongFromPlaylist(song, playlistSongs);
         setPlaylistSongs(newPlaylistSongs);
      } catch (error) {
         console.log(error);
         throw new Error("Error when remove song from playlist");
      } finally {
         setLoading(false);
         setIsOpenPopup(false);
      }
   };

   return {
      updateAndSetUserSongs,
      handleDeleteSong,
      handleAddSongToPlaylistMobile,
      handleRemoveSongFromPlaylist,
      handleAddSongToPlaylist,
      loading,
   };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

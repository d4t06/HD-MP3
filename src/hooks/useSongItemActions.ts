import { useSongsStore } from "../store/SongsContext";
import { Song, User } from "../types";
import { useCallback, useState } from "react";
import { useToast } from "../store";
import { deleteSong, mySetDoc } from "../utils/firebaseHelpers";

const useSongItemActions = () => {
   const {setErrorToast, setSuccessToast} = useToast()
   const { userPlaylists, setUserPlaylists, userSongs, setUserSongs } = useSongsStore();

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

 
   const hadnleDeleteSong = async (song: Song, userInfo: User) => {
      if (
         !userInfo ||
         !userSongs ||
         !userPlaylists ||
         !setUserSongs ||
         !setUserPlaylists
      ) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

         setLoading(true);
         let newUserSongs = [...userSongs];

         // eliminate 1 song
         const index = newUserSongs.indexOf(song);
         newUserSongs.splice(index, 1);

         if (newUserSongs.length === userSongs.length) {
            // errorLogger("Error newUserSongIds");
            setErrorToast({ message: "Error when handle user songs" });
            // closeModal();

            return;
         }

         const newUserSongIds = newUserSongs.map((songItem) => songItem.id);
         // >>> api
         await deleteSong(song);
         await mySetDoc({
            collection: "users",
            data: {
               song_ids: newUserSongIds,
               song_count: newUserSongIds.length,
            } as Partial<User>,
            id: userInfo.email,
            msg: ">>> api: update user doc",
         });

         setUserSongs(newUserSongs);

         // >>> finish
         // if (songInStore.id === data.id) {
         //    const emptySong = initSongObject({});
         //    dispatch(setSong({ ...emptySong, song_in: "user", currentIndex: 0 }));
         // }
         successLogger("delete song completed");
         setSuccessToast({ message: `'${song.name}' deleted` });
      
   };

   
   return {updateAndSetUserSongs, hadnleDeleteSong, loading };
};

export default useSongItemActions;

export type UseSongItemActionsType = ReturnType<typeof useSongItemActions>;

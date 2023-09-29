import { useSongsStore } from "../store/SongsContext";
import { useEffect, useState } from "react";
import { Song } from "../types";
import { Status } from "../store/SongSlice";
import { useActuallySongs } from "../components/Player";

const useGetActuallySongs = ({ songInStore }: { songInStore: Song & Status }) => {
   const { actuallySongs } = useActuallySongs();
   const { adminSongs, initial, userSongs } = useSongsStore();
   const [actuallySongList, setActuallySongList] = useState<Song[]>([]);

   // const getActuallySongList = useCallback(() => {
   //    console.log("getActuallySongList");

   //    switch (songInStore.song_in) {
   //       case "admin":
   //          setActuallySongList(adminSongs);
   //          break;
   //       case "":
   //          const songs = adminSongs.filter((adminSong) => {
   //             const condition = playlistInStore.song_ids.forEach(
   //                (songId) => songId === adminSong.id
   //             );
   //             return condition;
   //          });
   //          setActuallySongList(songs);
   //          break;

   //       case "user":
   //          setActuallySongList(userSongs);
   //          break;

   //       case "user-playlist":
   //          const userPlaylistsSongs = userSongs.filter((useSong) => {
   //             const condition = playlistInStore.song_ids.forEach(
   //                (songId) => songId === useSong.id
   //             );
   //             return condition;
   //          });
   //          setActuallySongList(userPlaylistsSongs);
   //          break;
   //    }
   // }, []);

   useEffect(() => {
      if (!initial) return;

      // songs in playlist
      if (songInStore.song_in.includes("playlist")) {
         setActuallySongList(actuallySongs);

         // admin songs
      } else if (songInStore.song_in === "admin") {
         setActuallySongList(adminSongs);

         // user songs
      } else {
         setActuallySongList(userSongs);
      }
   }, [songInStore.song_in, actuallySongs, userSongs]);

   return actuallySongList;
};

export default useGetActuallySongs;

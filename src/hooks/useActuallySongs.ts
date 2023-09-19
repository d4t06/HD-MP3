import { useSelector } from "react-redux";
import { useSongsStore } from "../store/SongsContext";
import { selectAllSongStore } from "../store/SongSlice";
import { useCallback, useEffect, useState } from "react";
import { Song } from "../types";

const useActuallySongs = () => {
   const { userSongs, adminSongs, initial } = useSongsStore()
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore)

   const [actuallySongList, setActuallySongList] = useState<Song[]>([]);


   const getActuallySongList = useCallback(() => {
      console.log("getActuallySongList");

      switch (songInStore.song_in) {
         case "admin":
            setActuallySongList(adminSongs);
            break;
         case "admin-playlist":
            const songs = adminSongs.filter((adminSong) => {
               const condition = playlistInStore.song_ids.forEach(
                  (songId) => songId === adminSong.id
               );
               return condition;
            });
            setActuallySongList(songs);
            break;

         case "user":
            setActuallySongList(userSongs);
            break;

         case "user-playlist":
            const userPlaylistsSongs = userSongs.filter((useSong) => {
               const condition = playlistInStore.song_ids.forEach(
                  (songId) => songId === useSong.id
               );
               return condition;
            });
            setActuallySongList(userPlaylistsSongs);
            break;
      }
   }, [songInStore.song_in, userSongs, adminSongs]);


   useEffect(() => {
      if (!initial) return;
      getActuallySongList();
   }, [songInStore.song_in, initial]);

   return { actuallySongList }
}


export default useActuallySongs
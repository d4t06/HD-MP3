import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist } from "../types";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";
import useUserSong from "./useUserSong";

export default function usePlaylistDetail() {
   const dispatch = useDispatch();
   const params = useParams();

   // const { loading:UseUserSongsLoading, initial } = useUserSong();

   const [loading, setLoading] = useState(false);
   const { playlist: playlistInStore, song: songInStore } = useSelector(selectAllSongStore);
   const [playlistSongIndexes, setPlaylistSongIndexes] = useState<number[]>([]);

   // // get playlist song indexes
   // const getSongIndexes = useCallback(() => {
   //    console.log("getSongIndexes");

   //    const indexes = playlistInStore.song_ids.map((id) => {
   //       return userSongs.findIndex((song) => song.id === id);
   //    });
   //    setPlaylistSongIndexes(indexes);
   // }, [playlistInStore]);

   // // get playlist data
   // const getPlaylist = useCallback(async () => {
   //    try {
   //       setLoading(true);
   //       const playlistSnap = await getDoc(
   //          doc(db, "playlist", `${params.name}_${userData.email}` as string)
   //       );
   //       if (playlistSnap) {
   //          const playlistData = playlistSnap.data() as Playlist;
   //          console.log("getPlaylist detail", playlistData);

   //          dispatch(setPlaylist(playlistData));
   //       }
   //    } catch (error) {
   //       console.log({ message: error });
   //    } finally {
   //       setLoading(false);
   //    }
   // }, [params, userData]);

   // useEffect(() => {
   //    if (!initial) {
   //       return setLoading(true);
   //    }
   //    if (playlistInStore.name) return;

   //    getPlaylist();
   // }, [initial]);

   // useEffect(() => {
   //  // console.log('check playlistInStore', playlistInStore.song_ids);
    
   //    if (playlistInStore?.song_ids.length) {
   //       getSongIndexes();
   //    }
   // }, [playlistInStore]);

  //  console.log("use playlist detail render");

   return {
      playlistSongIndexes,
      playlistInStore,
      songInStore,
      playlistId: `adfadsf`,
      userSongs: [],
      loading,
   };
}

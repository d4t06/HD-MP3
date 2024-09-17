import { useParams } from "react-router-dom";
import { myGetDoc } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../store";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import {
   selectCurrentPlaylist,
   setCurrentPlaylist,
   setPlaylistSongs,
} from "@/store/currentPlaylistSlice";

export default function useGetPlaylist() {
   // store
   const dispatch = useDispatch();

   const { currentPlaylist, playlistSongs } = useSelector(
      selectCurrentPlaylist
   );

   // hooks
   const params = useParams<PlaylistParamsType>();
   const { setErrorToast } = useToast();

   // state
   const ranEffect = useRef(false);
   const [isFetching, setIsFetching] = useState(true);

   const getPlaylist = async () => {
      if (!params.id) throw new Error("invalid playlist id");

      const playlistSnap = await myGetDoc({
         collection: "playlist",
         id: params.id,
         msg: ">>> api get playlist",
      });

      if (playlistSnap.exists()) return playlistSnap.data() as Playlist;
   };

   const getSongs = async (playlist: Playlist) => {
      if (!playlist.song_ids.length) return [];

      console.log(">>> api: get playlist songs", playlist.song_ids);
      const songsRef = collection(db, "songs");

      const queryGetSongs = query(
         songsRef,
         where("id", "in", playlist.song_ids)
      );
      const songsSnap = await getDocs(queryGetSongs);

      if (songsSnap.docs.length) {
         const songs = songsSnap.docs.map(
            (doc) =>
               ({
                  ...doc.data(),
                  song_in: `playlist_${playlist.id}`,
               } as SongWithSongIn)
         );
         return songs;

         // case actually song length do not match with data
         // because song have been deleted
         //   if (songs.length != currentPlaylist.song_ids.length) {
         //      console.log(">>> handle playlist, song modified");
         //      await handlePlaylistWhenSongsModified(songs);
         //   }
      } else {
         if (playlist.song_ids.length) setErrorToast({});
         return [];
      }
   };

   const init = async () => {
      try {
         if (!params.id) throw new Error("invalid playlist id");
         let targetPlaylist: Playlist | undefined;

         const isInStore = currentPlaylist.id === params.id;
         setIsFetching(true);

         if (!isInStore) targetPlaylist = await getPlaylist();
         else targetPlaylist = currentPlaylist;

         if (!targetPlaylist) throw new Error("playlist not found");

         const playlistSongs = await getSongs(targetPlaylist);

         if (!isInStore)
            dispatch(
               setCurrentPlaylist({
                  playlist: targetPlaylist,
                  songs: playlistSongs,
               })
            );

         dispatch(setPlaylistSongs({ songs: playlistSongs }));
         // setPlaylistSongs(playlistSongs);
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         setIsFetching(false);
      }
   };

   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;

         console.log("run init");

         init();
      }
   }, []);

   return { isFetching, setPlaylistSongs, playlistSongs, currentPlaylist };
}

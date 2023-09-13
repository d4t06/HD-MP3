import {
   collection,
   deleteDoc,
   doc,
   documentId,
   getDoc,
   getDocs,
   query,
   setDoc,
   where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist, Song } from "../types";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { useSongs } from "../store/SongsContext";

export default function usePlaylistDetail() {
   const dispatch = useDispatch();
   const { songs: userSongs } = useSongs();
   const [loggedInUser] = useAuthState(auth);
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);

   const [playlistSongs, setPlaylistSongs] = useState<Song[]>([])
   const [playlistId, setPlaylistId] = useState<string>()

   const params = useParams();

   const getSongs = useCallback( () => {
      setPlaylistSongs(userSongs.filter(song => playlistInStore.song_ids.includes(song.id)));
   }, [playlistInStore]);

   // get playlist data
   const getPlaylist = useCallback(async () => {
      try {
         console.log(playlistId)
         const playlistSnap = await getDoc(
            doc(db, "playlist", playlistId as string)
         );
         if (playlistSnap) {
            const playlistData = playlistSnap.data() as Playlist;

            console.log("check playlist", playlistData);

            dispatch(setPlaylist(playlistData));
         }
      } catch (error) {
         console.log({ message: error });
      }
   }, [params, playlistId]);


   useEffect(() => {
      
      const handlePlaylist = async () => {
         if (!playlistInStore.name) {
            await getPlaylist();
         }
         
         if (playlistInStore.song_ids.length) getSongs();
      };
      
      if (!playlistId) {
         setPlaylistId(`${params.name}_${loggedInUser?.email}`)
         return;
      }
      
      handlePlaylist();
   }, [playlistInStore, playlistId]);




   return {playlistSongs, playlistInStore, playlistId}
}

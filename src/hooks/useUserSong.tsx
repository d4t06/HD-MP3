import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongs } from "../store/SongsContext";

export default function useUserSong() {
   const userCollectionRef = collection(db, "users");
   const songsCollectionRef = collection(db, "songs");
   const playlistCollectionRef = collection(db, "playlist");

   const [playlistIds, setPlaylistIds] = useState<string[]>([]);
   const [loggedInUser] = useAuthState(auth);
   const [loading, setLoading] = useState(true);
   const firstTimeRender = useRef(true);

   const { initial, songs, playlists, init, setSongs, setPlaylists } = useSongs();
   const [userData, setUserData] = useState<{
      song_ids: string[];
      playlist_ids: string[];
      email: string;
   }>({ song_ids: [], playlist_ids: [], email: "" });

   // get all user playlists
   const getPlaylists = async () => {
      // console.log("run getPlaylists");
      try {
         const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where("by", "==", loggedInUser?.email)
         );

         const playlistSnap = await getDocs(queryGetUserPlaylist);
         const userPlaylist = playlistSnap.docs?.map((doc) => {
            const songData = doc.data() as Playlist;
            return { ...songData, id: doc.id };
         });

         return userPlaylist;
      } catch (error) {
         console.log(error);
      }
   };

   // get all user songs
   const initSongsAndPlaylists = async () => {
      console.log('run initial');

      setLoading(true);

      try {
         const userDocRef = doc(userCollectionRef, loggedInUser?.email as string);

         // get user data
         const userSnapShot = await getDoc(userDocRef);

         if (userSnapShot.exists()) {
            const userData = userSnapShot.data() as User;
            // get all user songs
            let songsList: Song[] = [];
            if (userData?.songs.length) {
               const queryGetUserSongs = query(
                  songsCollectionRef,
                  where("by", "==", loggedInUser?.email)
               );
               const songsSnapshot = await getDocs(queryGetUserSongs);

               songsList = songsSnapshot.docs?.map((doc) => {
                  const songData = doc.data() as Song;
                  return { ...songData, id: doc.id };
               });
            }

            //   get all user playlists
            let playlists: Playlist[] = [];
            if (userData?.playlist_ids.length) {
               const res = await getPlaylists();
               if (res?.length) playlists = res;
            }

            setUserData({
               song_ids: userData.songs,
               playlist_ids: userData.playlist_ids,
               email: userData.email,
            });
            init(songsList, playlists);
         }

         setLoading(false);
      } catch (error) {
         console.log({ message: error });
      }
   };

   // run initial
   useEffect(() => {
      
      if (firstTimeRender.current) firstTimeRender.current = false
      if (!initial) {
         initSongsAndPlaylists();
      } else {
         setLoading(false)
      }
   }, []);

   // run when playlistIds change
   // useEffect(() => {
   //    console.log('run playlistIds');

   //    if (!initial) return;
   //    if (firstTimeRender.current) return;
   //    const handlePlaylistIdsChange = async () => {
   //       console.log("run handlePlaylistIdsChange");

   //       const playlists = await getPlaylists();
   //       setPlaylists(playlists || []);
   //    };
   //    handlePlaylistIdsChange();
   // }, [playlistIds]);

   // 6 time render
   

   return {
      userData,
      songs,
      playlists,
      setSongs,
      setPlaylists,
      initial,
      setPlaylistIds,
      loading,
   };
}

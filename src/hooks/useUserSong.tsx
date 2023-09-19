import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongsStore } from "../store/SongsContext";

export default function useSong() {
   const songsCollectionRef = collection(db, "songs");
   const playlistCollectionRef = collection(db, "playlist");

   const [loggedInUser] = useAuthState(auth);
   const firstTimeRender = useRef(true);

   const {
      initial,
      adminSongs,
      // adminPlaylists,
      // userPlaylists,
      initSongsContext,
   } = useSongsStore();

   const [loading, setLoading] = useState(adminSongs.length ? false : true);
   const [errorMsg, setErrorMsg] = useState<string>("");


   const handleErrorMsg = (msg: string) => {
      setErrorMsg(msg);
      setLoading(false);
   };

   // get user data
   const getUserData = async () => {
      const userCollectionRef = collection(db, "users");
      const userDocRef = doc(userCollectionRef, loggedInUser?.email as string);

      // get user data
      try {
         const userSnapShot = await getDoc(userDocRef);

         if (userSnapShot.exists()) {
            return userSnapShot.data() as User;
         }
      } catch (error) {
         console.log(error);
      }
   };

   // get playlists
   const getUserPlaylists = async () => {
      // console.log("run getPlaylists");
      try {
         const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where("by", "==", loggedInUser?.email)
         );

         const playlistSnap = await getDocs(queryGetUserPlaylist);
         if (playlistSnap.docs.length) {
            return playlistSnap.docs?.map((doc) => doc.data() as Playlist);
         }
      } catch (error) {
         console.log("getUserPlaylists", error);
      }
   };

   // get admin song
   const getAdminSongsAndPlaylists = async () => {
      try {
         const queryGetAdminSongs = query(
            collection(db, "songs"),
            where("by", "==", "admin")
         );
         const queryGetAdminPlaylist = query(
            collection(db, "playlists"),
            where("by", "==", "admin")
         );

         const songsSnap = await getDocs(queryGetAdminSongs);
         const playlistsSnap = await getDocs(queryGetAdminPlaylist);

         const data: { adminSongs: Song[]; adminPlaylists: Playlist[] } = {
            adminSongs: [],
            adminPlaylists: [],
         };

         if (songsSnap.docs || playlistsSnap.docs) {
            const songs = songsSnap.docs.map((doc) => doc.data() as Song);
            const playlists = playlistsSnap.docs.map((doc) => doc.data() as Playlist);

            data.adminPlaylists = playlists || [];
            data.adminSongs = songs || [];

            return data;
         }
      } catch (error) {
         console.log({ message: error });
         handleErrorMsg("getAdminSongsAndPlaylists error");
      }
   };

   // get user songs
   const getUserSongsAndPlaylists = async () => {
      try {
         const userData = await getUserData() as User;
         const data: { userSongs: Song[]; userPlaylists: Playlist[] } = {
            userSongs: [],
            userPlaylists: [],
         };

         if (!userData) return;

         // get user songs
         if (userData?.song_ids.length) {
            const queryGetUserSongs = query(
               songsCollectionRef,
               where("by", "==", loggedInUser?.email)
            );
            const songsSnapshot = await getDocs(queryGetUserSongs);
            if (songsSnapshot.docs.length) {
               data.userSongs = songsSnapshot.docs.map((doc) => doc.data() as Song);
            }
         }

         // if user has playlist
         if (userData?.playlist_ids.length) {
            const playlists = await getUserPlaylists();
            if (playlists?.length) data.userPlaylists = playlists;
         }

         return {data, userData};
      } catch (error) {
         console.log({ message: error });
         handleErrorMsg("getUserSongsAndPlaylists error");
      }
   };

   const initSongsAndPlaylists = async () => {
      console.log("run initial");
      
      setLoading(true);
      const adminRes = await getAdminSongsAndPlaylists();
      const userRes = await getUserSongsAndPlaylists();

      if (adminRes && userRes) {

         const {data, userData} = userRes

         initSongsContext({ ...adminRes, ...data, userData });
         setLoading(false);
      }
   };

   // run initSongsAndPlaylists
   useEffect(() => {
      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         return;
      }
      if (!initial) {
         initSongsAndPlaylists();
      } else {
         setLoading(false);
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
      initial,
      loading,
      errorMsg,
   };
}

import { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { useAuthStore } from "../store/AuthContext";
// import { testSongs } from "./songs";
import { sleep } from "../utils/appHelpers";
import { useLocation } from "react-router-dom";
import appConfig from "../config/app";
import { testSongs } from "./songs";

export default function useSong({ admin }: { admin?: boolean }) {
   const { setErrorToast } = useToast();

   const { userInfo, setUserInfo } = useAuthStore();
   const { initial, initSongsContext } = useSongsStore();

   const [errorMsg, setErrorMsg] = useState<string>("");
   // const [loading, setLoading] = useState(
   //    adminSongs.length || userSongs.length ? false : true
   // );
   const [loading, setLoading] = useState(true);

   const hasRanInitFinish = useRef(true);

   const songsCollectionRef = collection(db, "songs");
   const playlistCollectionRef = collection(db, "playlist");

   const location = useLocation();

   const handleErrorMsg = (msg: string) => {
      setLoading(false);
      setErrorMsg(msg);
      setErrorToast({ message: "Use song error" });
   };

   const getAdminSongs = async () => {
      const queryGetAdminSongs = query(songsCollectionRef, where("by", "==", "admin"));
      const songsSnap = await getDocs(queryGetAdminSongs);

      if (songsSnap.docs) {
         const songs = songsSnap.docs.map((doc) => doc.data() as Song);

         return songs;
      }
   };

   const getAdminPLaylist = async () => {
      const queryGetAdminPlaylist = query(
         playlistCollectionRef,
         where("by", "==", "admin")
      );

      const playlistsSnap = await getDocs(queryGetAdminPlaylist);

      if (playlistsSnap.docs) {
         const playlists = playlistsSnap.docs.map((doc) => doc.data() as Playlist);
         return playlists;
      }
   };

   const getAndSetFullUserInfo = async () => {
      const userCollectionRef = collection(db, "users");
      const userDocRef = doc(userCollectionRef, userInfo?.email as string);

      // get user data
      try {
         const userSnapShot = await getDoc(userDocRef);

         if (userSnapShot.exists()) {
            const fullUserInfo = userSnapShot.data() as User;

            setUserInfo({
               latest_seen: fullUserInfo.latest_seen,
               song_ids: fullUserInfo.song_ids,
               song_count: fullUserInfo.song_count,
               playlist_ids: fullUserInfo.playlist_ids,
               role: fullUserInfo.role,
               like_song_ids: fullUserInfo.like_song_ids,
               like_playlist_ids: fullUserInfo.like_playlist_ids
            });

            return fullUserInfo;
         }
      } catch (error) {
         console.log(error);
         handleErrorMsg("Get userData error");
      }
   };

   const getUserPlaylists = async (fullUserInfo: User) => {
      try {
         const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where("id", "in", fullUserInfo.playlist_ids)
         );

         const playlistSnap = await getDocs(queryGetUserPlaylist);
         if (playlistSnap.docs.length) {
            const userPlaylists = playlistSnap.docs.map((doc) => doc.data() as Playlist);

            return userPlaylists;
         }
      } catch (error) {
         console.log("getUserPlaylists", error);
         handleErrorMsg("Get users playlist error");
      }
   };

   const getUserSongs = async (fullUserInfo: User) => {
      try {
         const queryGetUserSongs = query(
            songsCollectionRef,
            where("id", "in", fullUserInfo.song_ids)
         );

         const songsSnapshot = await getDocs(queryGetUserSongs);
         if (songsSnapshot.docs.length) {
            const songs = songsSnapshot.docs.map((doc) => doc.data() as Song);
            return songs;
         }
      } catch (error) {
         console.log("getUserPlaylists", error);
         handleErrorMsg("Get users playlist error");
      }
   };

   // get user songs
   const getUserSongsAndPlaylists = async (fullUserInfo: User) => {
      try {
         const userData: { userSongs: Song[]; userPlaylists: Playlist[] } = {
            userSongs: [],
            userPlaylists: [],
         };

         //  get user song
         if (fullUserInfo?.song_ids?.length) {
            const userSongs = await getUserSongs(fullUserInfo);
            if (userSongs?.length) userData.userSongs = userSongs;
         }

         // get user playlist
         if (fullUserInfo?.playlist_ids?.length) {
            const playlists = await getUserPlaylists(fullUserInfo);
            if (playlists?.length) userData.userPlaylists = playlists;
         }

         return userData;
      } catch (error) {
         console.log({ message: error });
         handleErrorMsg("GetUserSongsAndPlaylists error");
      }
   };

   const initSongsAndPlaylists = async () => {
      try {
         setLoading(true);

         // // case for all
         // const adminSongs = await getAdminSongs();
         // const adminPlaylists = await getAdminPLaylist();


         // console.log(adminSongs);
         // console.log(adminPlaylists);
         
         // // case no logged in
         // if (!userInfo.email || admin) {
         //    console.log(">>> run initial, no user");

         //    await sleep(1000);

         //    initSongsContext({
         //       adminSongs,
         //       adminPlaylists,
         //       userPlaylists: [],
         //       userSongs: [],
         //    });

         //    setLoading(false);
         //    return;
         // }

         // //  case logged
         // const fullUserInfo = await getAndSetFullUserInfo();

         // if (fullUserInfo) {
         //    console.log(">>> run initial, have user");

         //    const userData = await getUserSongsAndPlaylists(fullUserInfo);

         //    console.log('user data', userData);
            
         //    // update songs context
         //    initSongsContext({ ...userData, adminSongs, adminPlaylists });
         // }

         //  case logged
         await sleep(1000);
         const fullUserInfo = (await getAndSetFullUserInfo()) as User;

         setUserInfo({
            latest_seen: fullUserInfo.latest_seen,
            song_ids: fullUserInfo.song_ids,
            song_count: fullUserInfo.song_count,
            playlist_ids: fullUserInfo.playlist_ids,
            role: fullUserInfo.role,
         });
         initSongsContext({
            userSongs: testSongs,
            adminSongs: testSongs,
         });
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "init song error" });
      } finally {
         setLoading(false);
         hasRanInitFinish.current = true;
      }
   };

   // run initSongsAndPlaylists
   useEffect(() => {
      if (admin) {
         if (initial) {
            setTimeout(() => setLoading(false), appConfig.loadingDuration);
         }
         return;
      }
      // setLoading(true);

      if (userInfo.status === "loading") {
         return;
      }

      if (location.pathname === "/mysongs" && !userInfo.email) {
         console.log(">>> skip init because in /mysongs but no user");
         // setLoading(true);
         return;
      }

      if (!initial && hasRanInitFinish.current) {
         hasRanInitFinish.current = false;
         initSongsAndPlaylists();

         return;
      } else if (initial) {
         console.log("Already init");
 
         setTimeout(() => setLoading(false), appConfig.loadingDuration);
         return;
      }
   }, [userInfo.status, initial]);
   // user loading x1
   // loading x2
   // 3 time re-render

   return {
      initial,
      loading,
      errorMsg,
      getAdminPLaylist,
      getAdminSongs,
      initSongsAndPlaylists,
   };
}

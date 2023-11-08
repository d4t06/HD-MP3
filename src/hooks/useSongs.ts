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

export default function useSong({ admin }: { admin?: boolean }) {
   const { setErrorToast } = useToast();

   const { userInfo, setUserInfo } = useAuthStore();
   const { initial, adminSongs, initSongsContext, userSongs } = useSongsStore();

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

   // admin song
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

   // user
   const getUserInfo = async () => {
      if (!userInfo.email) return;

      const userCollectionRef = collection(db, "users");
      const userDocRef = doc(userCollectionRef, userInfo?.email as string);

      // get user data
      try {
         const userSnapShot = await getDoc(userDocRef);

         if (userSnapShot.exists()) {
            return userSnapShot.data() as User;
         }
      } catch (error) {
         console.log(error);
         handleErrorMsg("Get userData error");
      }
   };

   const getUserPlaylists = async () => {
      // console.log("run getPlaylists");
      try {
         const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where("by", "==", userInfo?.email)
         );

         const playlistSnap = await getDocs(queryGetUserPlaylist);
         if (playlistSnap.docs.length) {
            return playlistSnap.docs?.map((doc) => doc.data() as Playlist);
         }
      } catch (error) {
         console.log("getUserPlaylists", error);
         handleErrorMsg("Get users playlist error");
      }
   };

   // get user songs
   const getUserSongsAndPlaylists = async () => {
      try {
         // get user info
         const userInfo = (await getUserInfo()) as User;
         const userData: { userSongs: Song[]; userPlaylists: Playlist[] } = {
            userSongs: [],
            userPlaylists: [],
         };

         //  get user song
         if (userInfo?.song_ids?.length) {
            const queryGetUserSongs = query(
               songsCollectionRef,
               where("by", "==", userInfo?.email)
            );
            const songsSnapshot = await getDocs(queryGetUserSongs);
            if (songsSnapshot.docs.length) {
               userData.userSongs = songsSnapshot.docs.map((doc) => doc.data() as Song);
            }
         }

         // get user playlist
         if (userInfo?.playlist_ids?.length) {
            const playlists = await getUserPlaylists();
            if (playlists?.length) userData.userPlaylists = playlists;
         }

         return { userData, userInfo };
      } catch (error) {
         console.log({ message: error });
         handleErrorMsg("GetUserSongsAndPlaylists error");
      }
   };

   const initSongsAndPlaylists = async () => {
      try {
         setLoading(true);

         // case for all
         const adminSongs = await getAdminSongs();
         const adminPlaylists = await getAdminPLaylist();

         // case no logged in
         if (!userInfo.email || admin) {
            console.log(">>> run initial, no user");

            await sleep(2000);

            initSongsContext({
               adminSongs,
               adminPlaylists,
               userPlaylists: [],
               userSongs: [],
            });

            setLoading(false);
            return;
         }

         //  case logged
         const userRes = await getUserSongsAndPlaylists();
         if (userRes) {
            console.log(">>> run initial, have user");
            const { userInfo: fullUserInfo, userData } = userRes;

            // update songs context
            initSongsContext({ ...userData, adminSongs, adminPlaylists });

            // update user context
            setUserInfo({
               latest_seen: fullUserInfo.latest_seen,
               song_ids: fullUserInfo.song_ids,
               song_count: fullUserInfo.song_count,
               playlist_ids: fullUserInfo.playlist_ids,
               role: fullUserInfo.role,
            });
         }

         // //  case logged
         // await sleep(1000);
         // const fullUserInfo = (await getUserInfo()) as User;

         // setUserInfo({
         //    latest_seen: fullUserInfo.latest_seen,
         //    song_ids: fullUserInfo.song_ids,
         //    song_count: fullUserInfo.song_count,
         //    playlist_ids: fullUserInfo.playlist_ids,
         //    role: fullUserInfo.role,
         // });
         // initSongsContext({
         //    userSongs: testSongs,
         //    adminSongs: testSongs,
         // });
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
      } else {
         console.log("Already init");

         setTimeout(() => setLoading(false), appConfig.loadingDuration);
         return;
      }
   }, [userInfo, initial]);
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

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongsStore } from "../store/SongsContext";
// import { testSongs } from "./songs";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";
import { testPlaylists, testSongs } from "./songs";

export default function useSong() {
   const { setToasts } = useToast();

   const [loggedInUser, userLoading] = useAuthState(auth);
   const { initial, adminSongs, initSongsContext, userSongs } = useSongsStore();

   const [errorMsg, setErrorMsg] = useState<string>("");
   const [loading, setLoading] = useState(
      adminSongs.length || userSongs.length ? false : true
   );

   const songsCollectionRef = collection(db, "songs");
   const playlistCollectionRef = collection(db, "playlist");

   const handleErrorMsg = (msg: string) => {
      setLoading(false);
      setErrorMsg(msg);
      setToasts((t) => [...t, { title: "error", desc: msg, id: nanoid(4) }]);
   };

   // get user data
   const getUserData = async () => {
      if (!loggedInUser) return;

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
         handleErrorMsg("Get userData error");
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
         handleErrorMsg("GetAdminSongsAndPlaylists error");
      }
   };

   // get user songs
   const getUserSongsAndPlaylists = async () => {
      try {
         const userData = (await getUserData()) as User;
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

         return { data, userData };
      } catch (error) {
         console.log({ message: error });

         // handleErrorMsg("GetUserSongsAndPlaylists error");
      }
   };

   const initSongsAndPlaylists = async () => {
      console.log("run initial");

      setLoading(true);

      // const userData = (await getUserData()) as User;
      // await new Promise<void>((rs) => {
      //    setTimeout(() => {
      //       initSongsContext({
      //          userSongs: testSongs || [],
      //          adminSongs: testSongs,
      //          adminPlaylists: [],
      //          userPlaylists: [],
      //          userData: {} as User,
      //       });
      //       setLoading(false);

      //       rs();
      //    }, 500);
      // });

      const adminRes = await getAdminSongsAndPlaylists();
      const userRes = await getUserSongsAndPlaylists();

      if (adminRes && userRes) {
         const { data, userData } = userRes;
         console.log("check userPlaylists", data.userPlaylists);

         initSongsContext({ ...data, ...adminRes, userData });
      }
      setLoading(false);
   };

   // run initSongsAndPlaylists
   useEffect(() => {
      if (userLoading) return;

      if (adminSongs.length || userSongs.length) {
         // console.log("initial return cause have songs in context");
         return;
      }

      if (!initial) {
         initSongsAndPlaylists();
      } else {
         setLoading(false);
      }
   }, [userLoading]);

   // console.log("check render useSongs");

   // 5 time render

   return {
      initial,
      loading,
      errorMsg,
   };
}

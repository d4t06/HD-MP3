import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { useAuthStore } from "../store/AuthContext";
import { testSongs } from "./songs";
import { sleep } from "../utils/appHelpers";

export default function useSong() {
  const { setErrorToast } = useToast();

  const { userInfo, setUserInfo } = useAuthStore();
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
    setErrorToast({ message: "Use song error" });
  };

  // admin song
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
      console.log("run initial");
      setLoading(true);

      let adminData: Awaited<ReturnType<typeof getAdminSongsAndPlaylists>>;

      //  case for all
      if (!adminSongs.length) {
        console.log("get admin data");
        // adminData = await getAdminSongsAndPlaylists();
      }

      // case no logged in
      if (!userInfo.email) {
        console.log("no logged in");
        // initSongsContext({ ...adminData, userPlaylists: [], userSongs: [] });
        await sleep(2000);
        initSongsContext({
          adminSongs: testSongs,
        });

        setLoading(false);
        return;
      }

      // case logged
      const userRes = await getUserSongsAndPlaylists();
      if (userRes) {
        console.log("logged in");
        // const { userInfo: fullUserInfo, userData } = userRes;

        // // update songs context
        // if (adminData) {
        //    initSongsContext({ ...userData, ...adminData });
        // } else {
        //    initSongsContext({ ...userData });
        // }

        // // update user context
        // setUserInfo({
        //    latest_seen: fullUserInfo.latest_seen,
        //    song_ids: fullUserInfo.song_ids,
        //    song_count: fullUserInfo.song_count,
        //    playlist_ids: fullUserInfo.playlist_ids,
        //    role: fullUserInfo.role,
      }

      await sleep(2000);
      const fullUserInfo = (await getUserInfo()) as User;
      console.log("check user info", fullUserInfo);

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
        // });
      });
    } catch (error) {
      console.log(error);
      setErrorToast({ message: "init song error" });
    } finally {
      setLoading(false);
    }
  };

  // run initSongsAndPlaylists
  useEffect(() => {
    console.log(">>> run useEffect", userInfo);

    if (userInfo.status === "loading") {
      setLoading(true);
      return;
    }

    if (!initial) {
      initSongsAndPlaylists();
      return;

    } else {
      setLoading(false);
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
  };
}

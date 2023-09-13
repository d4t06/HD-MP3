import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Playlist, Song, User } from "../types";
import { useSongs } from "../store/SongsContext";

export default function useUserSong() {
  const userCollectionRef = collection(db, "users");
  const songsCollectionRef = collection(db, "songs");
  const playlistCollectionRef = collection(db, "playlist");

  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [loggedInUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const isInitDone = useRef(false);

  const { songs, playlists, init, setSongs, setPlaylists } = useSongs();
  const [userData, setUserData] = useState<{
    song_ids: string[];
    playlist_ids: string[];
    email: string;
  }>({ song_ids: [], playlist_ids: [], email: "" });

  // get all user playlists
  const getPlaylists = async () => {
    console.log("run getPlaylists");
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
  const initial = async () => {
    console.log("run initial");

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
        isInitDone.current = true;
      }

      setLoading(false);
    } catch (error) {
      console.log({ message: error });
    }
  };

  //   useEffect(() => {
  //     if (!songs.length || !playlists.length) {
  //       initial();
  //     }
  //   }, []);

  useEffect(() => {
    const handlePlaylistIdsChange = async () => {
      console.log("run handlePlaylistIdsChange");

      const playlists = await getPlaylists();
      setPlaylists(playlists || []);
    };
    if (!isInitDone.current) return;
    handlePlaylistIdsChange();
  }, [playlistIds]);

  //   console.log('use user song check', {userData, songs, playlistIds, playlists});

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

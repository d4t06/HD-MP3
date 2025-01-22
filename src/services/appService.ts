import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from "nanoid";

const songsCollectionRef = collection(db, "songs");
const playlistCollectionRef = collection(db, "playlist");

type GetUserSong = {
  variant: "user";
  email: string;
};

type GetHomeSong = {
  variant: "home";
};

type GetDashboardSong = {
  variant: "dashboard";
};

export const getSongs = async (props: GetUserSong | GetHomeSong | GetDashboardSong) => {
  let getSongQuery;

  switch (props.variant) {
    case "user":
      getSongQuery = query(songsCollectionRef, where("by", "==", props.email), limit(10));
      break;
    case "home":
      getSongQuery = query(songsCollectionRef, where("by", "==", "admin"), limit(10));
      break;
    case "dashboard":
      getSongQuery = query(songsCollectionRef, where("by", "==", "admin"), limit(20));
      break;
  }

  const songsSnap = await getDocs(getSongQuery);

  if (songsSnap.docs) {
    const songs = songsSnap.docs.map(
      (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) }) as Song,
    );

    return songs;
  }
};

type GetPlaylist = {
  variant: "admin";
};

type GetUserPlaylist = {
  variant: "user";
  email: string;
};

export const getPlaylists = async (props: GetPlaylist | GetUserPlaylist) => {
  let getPlaylistQuery;

  switch (props.variant) {
    case "admin":
      getPlaylistQuery = query(playlistCollectionRef, where("by", "==", "admin"), limit(20));
      break;
    case "user":
      getPlaylistQuery = query(playlistCollectionRef, where("by", "==", props.email));
      break;
  }

  const playlistsSnap = await getDocs(getPlaylistQuery);

  if (playlistsSnap.docs) {
    const playlists = playlistsSnap.docs.map((doc) => doc.data() as Playlist);
    return playlists;
  }
};

// get user songs
export const getUserSongsAndPlaylists = async (email: string) => {
  const userData: { userSongs: Song[]; userPlaylists: Playlist[] } = {
    userSongs: [],
    userPlaylists: [],
  };

  //  get user song
  const userSongs = await getSongs({
    variant: "user",
    email,
  });
  if (userSongs?.length) userData.userSongs = userSongs;

  // get user playlist
  const playlists = await getPlaylists({
    variant: "user",
    email,
  });
  if (playlists?.length) userData.userPlaylists = playlists;

  return userData;
};

export const getUserInfo = async (email: string) => {
  const userCollectionRef = collection(db, "users");
  const userDocRef = doc(userCollectionRef, email);

  const userSnapShot = await getDoc(userDocRef);

  if (userSnapShot.exists()) {
    const fullUserInfo = userSnapShot.data() as User;

    return fullUserInfo;
  }
};

export const searchSong = async (value: string) => {
  const songsCollectionRef = collection(db, "songs");

  const searchQuery = query(
    songsCollectionRef,
    where("name", ">=", value),
    where("name", "<=", value + "\uf8ff"),
    where("by", "==", "admin"),
  );

  const songsSnap = await getDocs(searchQuery);

  if (songsSnap.docs) {
    const result = songsSnap.docs.map((doc) => doc.data() as Song);

    return result;
  }
};

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const songsCollectionRef = collection(db, "songs");
const playlistCollectionRef = collection(db, "playlist");

export const getAdminSongs = async () => {
   const queryGetAdminSongs = query(songsCollectionRef, where("by", "==", "admin"));
   const songsSnap = await getDocs(queryGetAdminSongs);

   if (songsSnap.docs) {
      const songs = songsSnap.docs.map(
         (doc) => ({ ...doc.data(), song_in: "admin" } as Song)
      );

      return songs;
   }
};

export const getAdminPLaylist = async () => {
   const queryGetAdminPlaylist = query(playlistCollectionRef, where("by", "==", "admin"));

   const playlistsSnap = await getDocs(queryGetAdminPlaylist);

   if (playlistsSnap.docs) {
      const playlists = playlistsSnap.docs.map((doc) => doc.data() as Playlist);
      return playlists;
   }
};

const getUserPlaylists = async (fullUserInfo: User) => {
   const queryGetUserPlaylist = query(
      playlistCollectionRef,
      where("by", "==", fullUserInfo.email)
   );

   const playlistSnap = await getDocs(queryGetUserPlaylist);
   if (playlistSnap.docs.length) {
      const userPlaylists = playlistSnap.docs.map((doc) => doc.data() as Playlist);

      return userPlaylists;
   }
};

const getUserSongs = async (fullUserInfo: User) => {
   const queryGetUserSongs = query(
      songsCollectionRef,
      where("by", "==", fullUserInfo.email)
   );

   const songsSnapshot = await getDocs(queryGetUserSongs);
   if (songsSnapshot.docs.length) {
      const songs = songsSnapshot.docs.map(
         (doc) => ({ ...doc.data(), song_in: "user" } as Song)
      );

      return songs;
   }
};

// get user songs
export const getUserSongsAndPlaylists = async (fullUserInfo: User) => {
   const userData: { userSongs: Song[]; userPlaylists: Playlist[] } = {
      userSongs: [],
      userPlaylists: [],
   };

   //  get user song
   const userSongs = await getUserSongs(fullUserInfo);
   if (userSongs?.length) userData.userSongs = userSongs;

   // get user playlist
   const playlists = await getUserPlaylists(fullUserInfo);
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

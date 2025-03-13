import {
  Query,
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
import { playlistCollectionRef, songsCollectionRef, uploadBlob } from "./firebaseService";
import { getBlurHashEncode, optimizeImage } from "./imageService";

type GetUserSong = {
  variant: "user";
  email: string;
};

type GetSystemSong = {
  variant: "system";
};

export const getSongs = async (props: GetUserSong | GetSystemSong) => {
  let getSongQuery;

  switch (props.variant) {
    case "user":
      getSongQuery = query(
        songsCollectionRef,
        where("owner_email", "==", props.email),
        limit(10)
      );
      break;
    case "system":
      getSongQuery = query(
        songsCollectionRef,
        where("is_official", "==", "true"),
        limit(10)
      );
      break;
  }

  const songsSnap = await getDocs(getSongQuery);

  if (songsSnap.docs) {
    const songs = songsSnap.docs.map((doc) => {
      const song: Song = {
        ...(doc.data() as SongSchema),
        queue_id: nanoid(4),
        id: doc.id,
      };
      return song;
    });

    return songs;
  }
};

type GetSystemPlaylist = {
  variant: "system";
};

type GetUserPlaylist = {
  variant: "user";
  email: string;
};

export const getPlaylists = async (props: GetSystemPlaylist | GetUserPlaylist) => {
  let getPlaylistQuery;

  switch (props.variant) {
    case "system":
      getPlaylistQuery = query(
        playlistCollectionRef,
        where("is_public", "==", "true"),
        limit(20)
      );
      break;
    case "user":
      getPlaylistQuery = query(
        playlistCollectionRef,
        where("owner_email", "==", props.email)
      );
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

export async function implementSongQuery(
  query: Query,
  opts?: { getQueueId: (s: Song) => string }
) {
  const songsSnap = await getDocs(query);

  if (songsSnap.docs) {
    const result = songsSnap.docs.map((doc) => {
      const song: Song = {
        ...(doc.data() as SongSchema),
        id: doc.id,
        queue_id: nanoid(4),
      };

      if (opts?.getQueueId) {
        song.queue_id = opts.getQueueId(song);
      }
      return song;
    });

    return result;
  } else return [];
}

export async function implementPlaylistQuery(query: Query) {
  const playlistsSnap = await getDocs(query);

  if (playlistsSnap.docs.length) {
    const result = playlistsSnap.docs.map((doc) => {
      const playlist: Playlist = { ...(doc.data() as PlaylistSchema), id: doc.id };
      return playlist;
    });

    return result;
  } else return [];
}

export const optimizeAndGetHashImage = async (imageFile: File) => {
  const imageBlob = await optimizeImage(imageFile);
  if (imageBlob == undefined) throw new Error("File not found");

  const uploadProcess = uploadBlob({
    blob: imageBlob,
    folder: "/images/",
  });

  const { encode } = await getBlurHashEncode(imageBlob);
  const { filePath, fileURL } = await uploadProcess;

  return {
    image_file_path: filePath,
    image_url: fileURL,
    blurhash_encode: encode,
  };
};

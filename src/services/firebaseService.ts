import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { convertToEn, request } from "@/utils/appHelpers";
import { upload } from "@imagekit/react";

type collectionVariant =
  | "Songs"
  | "Playlists"
  | "Lyrics"
  | "Users"
  | "Singers"
  | "Genres"
  | "Granted_Accounts"
  | "Comments"
  | "Trending_Metrics"
  | "Categories"
  | "Category_Lobby";

// const isDev = import.meta.env.DEV;
const isDev = true;

export const songsCollectionRef = collection(db, "Songs");
export const playlistCollectionRef = collection(db, "Playlists");
export const singerCollectionRef = collection(db, "Singers");
export const userCollectionRef = collection(db, "Users");
export const lyricCollectionRef = collection(db, "Lyrics");
export const commentCollectionRef = collection(db, "Comments");
export const dailySongCollectionRef = collection(db, "DailySong");
export const weeklySongCollectionRef = collection(db, "DailySong");
export const genresCollectionRef = collection(db, "Genres");
export const trendingCollectionRef = collection(db, "Trending_Metrics");
export const categoriesCollectionRef = collection(db, "Categories");

export const myDeleteDoc = async ({
  collectionName,
  id,
  msg,
}: {
  collectionName: collectionVariant;
  id: string;
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: delete doc");
  await deleteDoc(doc(db, collectionName, id));
};

export const myGetDoc = async ({
  collectionName,
  id,
  msg,
}: {
  collectionName: collectionVariant;
  id: string;
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: get doc");

  return getDoc(doc(db, collectionName, id));
};

export const myAddDoc = async ({
  collectionName,
  data,
  msg,
}: {
  collectionName: collectionVariant;
  data: {};
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: add doc");

  return await addDoc(collection(db, collectionName), data);
};

export const myUpdateDoc = async ({
  collectionName,
  id,
  data,
  msg,
}: {
  collectionName: collectionVariant;
  id: string;
  data: {};
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: update doc");

  return await updateDoc(doc(db, collectionName, id), data);
};

type ImageKitAuthKeys = {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
};

export const uploadFile = async ({
  file,
  msg,
  folder,
}: {
  file: File;
  folder: "/images/" | "/songs/";
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: upload file");
  const start = Date.now();

  const authToken = await auth.currentUser?.getIdToken(true);

  const res = await request.get<{ data: ImageKitAuthKeys }>("/storage/auth", {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  const { expire, token, signature, publicKey } = res.data.data;

  const parts = file.name.split(".");
  const extension = parts.pop();
  const name = parts.join("_");

  const { url, fileId } = await upload({
    expire,
    token,
    signature,
    publicKey,
    file,
    fileName: convertToEn(name) + "." + extension,
    folder: `/hd-mp3${folder}`,
  });

  const consuming = (Date.now() - start) / 1000;
  if (isDev) console.log(">>> api: upload file finished after", consuming);

  return { url, fileId };
};

export const deleteFile = async ({
  fileId,
  msg,
}: {
  fileId: string;
  msg?: string;
}) => {
  try {
    if (isDev) console.log(msg ?? ">>> api: delete file");

    const token = await auth.currentUser?.getIdToken(true);
    if (!token) return;

    await request.delete<{ data: ImageKitAuthKeys }>(`/storage/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteSongFiles = async (song: Song) => {
  try {
    deleteFile({
      fileId: song.song_file_id,
      msg: ">>> api: delete song file",
    });

    if (song.beat_file_id) {
      deleteFile({
        fileId: song.beat_file_id,
        msg: `>>> api: delete song's image file`,
      });
    }

    if (song.image_file_id) {
      deleteFile({
        fileId: song.image_file_id,
        msg: `>>> api: delete song's image file`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const increaseSongPlay = (songId: string) => {
  try {
    const newSongData = {
      total_play: increment(1),
      today_play: increment(1),
      week_play: increment(1),
      last_active: serverTimestamp(),
    };

    myUpdateDoc({
      id: songId,
      collectionName: "Songs",
      data: newSongData,
      msg: "Increase song play",
    });
  } catch (error) {
    console.log(error);
  }
};

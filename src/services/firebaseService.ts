import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, stores } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

type collectionVariant =
  | "Songs"
  | "Playlists"
  | "Lyrics"
  | "Users"
  | "Singers"
  | "Genres"
  | "Granted_Accounts";

const isDev: boolean = import.meta.env.DEV;

export const songsCollectionRef = collection(db, "Songs");
export const playlistCollectionRef = collection(db, "Playlists");

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

export const uploadFile = async ({
  file,
  folder,
  namePrefix,
  msg,
}: {
  file: File;
  folder: "/images/" | "/songs/";
  namePrefix: string;
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: upload file");
  const start = Date.now();

  // define ref
  const fileName =
    namePrefix.replace("@gmail.com", "") +
    "_" +
    file.name.replaceAll(" ", "").toLowerCase();
  const fileRef = ref(stores, `${folder + fileName}`);

  const fileRes = await uploadBytes(fileRef, file);
  const fileURL = await getDownloadURL(fileRes.ref);
  const consuming = (Date.now() - start) / 1000;
  if (isDev) console.log(">>> api: upload file finished after", consuming);

  return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const uploadBlob = async ({
  blob,
  folder,
  msg,
}: {
  blob: Blob;
  folder: "/images/" | "/songs/";
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: Upload blob");
  const start = Date.now();

  // define ref
  // try {
  const fileName = Date.now();
  const fileRef = ref(stores, `${folder + fileName}`);
  const fileRes = await uploadBytes(fileRef, blob);
  const fileURL = await getDownloadURL(fileRes.ref);

  const consuming = (Date.now() - start) / 1000;
  if (isDev) console.log(">>> api: Upload blob finished after", consuming);

  return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const deleteFile = async ({
  filePath,
  msg,
}: {
  filePath: string;
  msg?: string;
}) => {
  if (isDev) console.log(msg ?? ">>> api: delete file");

  const fileRef = ref(stores, filePath);
  await deleteObject(fileRef);
};

export const deleteSong = async (song: Song) => {
  await myDeleteDoc({
    collectionName: "Songs",
    id: song.id,
    msg: ">>> api: delete song doc",
  });

  await deleteFile({
    filePath: song.song_file_path,
    msg: ">>> api: delete song file",
  });

  if (song.is_has_lyric) {
    await myDeleteDoc({
      collectionName: "Lyrics",
      id: song.id,
      msg: ">>> api: delete song lyric doc",
    });
  }

  if (song.image_file_path) {
    await deleteFile({
      filePath: song.image_file_path,
      msg: `>>> api: delete song's image file`,
    });
  }
};

export const setPlaylistDoc = async ({ playlist }: { playlist: Playlist }) => {
  await myUpdateDoc({
    collectionName: "Playlists",
    data: playlist,
    id: playlist.id,
    msg: ">>> api: set playlist",
  });
};

export const setUserPlaylistIdsDoc = async (playlists: Playlist[], user: User) => {
  const newPlaylistIds = playlists.map((playlist) => playlist.id);
  await myUpdateDoc({
    collectionName: "Users",
    data: { playlist_ids: newPlaylistIds } as Partial<User>,
    id: user.email,
    msg: ">>> api: set user playlist_ids",
  });
};

export const setUserSongIdsAndCountDoc = async ({
  songIds,
  user,
}: {
  songIds: string[];
  user: User;
}) => {
  await myUpdateDoc({
    collectionName: "Users",
    data: { song_ids: songIds, song_count: songIds.length } as Partial<User>,
    id: user.email,
    msg: ">>> api: set user song_ids, song_count",
  });
};

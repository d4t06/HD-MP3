import { Playlist, Song, User } from "../types";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, store } from "../config/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

type collectionVariant = "songs" | "playlist" | "lyrics" | "users";

export const myDeleteDoc = async ({
   collection,
   id,
}: {
   collection: collectionVariant;
   id: string;
}) => {
   console.log("delete doc");

   await deleteDoc(doc(db, collection, id));
};

export const myGetDoc = async ({
   collection,
   id,
}: {
   collection: collectionVariant;
   id: string;
}) => {
   console.log("get doc");

   return getDoc(doc(db, collection, id));
};

export const mySetDoc = async ({
   collection,
   id,
   data,
}: {
   collection: collectionVariant;
   id: string;
   data: {};
}) => {
   console.log("set doc");

   return setDoc(doc(db, collection, id), { ...data }, { merge: true });
};

export const uploadFile = async ({
   file,
   folder,
   email,
}: {
   file: File;
   folder: "/images/" | "/songs/";
   email: string;
}) => {
   console.log("upload file");
   const start = Date.now();

   // define ref
   const fileName =
      file.name.replaceAll(" ", "").toLowerCase() + "_" + email.replace("@gmail.com", "");
   const fileRef = ref(store, `${folder + fileName}`);
   const fileRes = await uploadBytes(fileRef, file);
   const fileURL = await getDownloadURL(fileRes.ref);

   const consuming = (Date.now() - start) / 1000
   console.log("Upload file finished after", consuming);

   return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const uploadBlob = async ({
   blob,
   folder,
   songId,
}: {
   blob: Blob;
   folder: "/images/" | "/songs/";
   songId: string;
}) => {
   console.log("upload blob");
   const start = Date.now();

   // define ref
   const fileName = songId + "_stock"
   const fileRef = ref(store, `${folder + fileName}`);
   const fileRes = await uploadBytes(fileRef, blob);
   const fileURL = await getDownloadURL(fileRes.ref);

   const consuming = (Date.now() - start) / 1000
   console.log("Upload blob finished after", consuming);

   return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const deleteFile = async ({ filePath }: { filePath: string }) => {
   console.log("delete file");

   const fileRef = ref(store, filePath);
   await deleteObject(fileRef);
};

export const deleteSong = async (song: Song) => {
   await deleteDoc(doc(db, "songs", song.id));

   await deleteFile({filePath: song.song_file_path})

   if (song.lyric_id) {
      await deleteDoc(doc(db, "lyrics", song.lyric_id));
   }

   if (song.image_file_path) {
      await deleteFile({ filePath: song.image_file_path });
   }
};

export const setPlaylistDoc = async ({ playlist }: { playlist: Playlist }) => {
   await mySetDoc({ collection: "playlist", data: playlist, id: playlist.id });
};

export const setUserPlaylistIdsDoc = async (playlists: Playlist[], userInfo: User) => {
   const newPlaylistIds = playlists.map((playlist) => playlist.id);
   await mySetDoc({
      collection: "users",
      data: { playlist_ids: newPlaylistIds } as Partial<User>,
      id: userInfo.email,
   });
};

export const setUserSongIdsAndCountDoc = async ({
   songIds,
   userInfo,
}: {
   songIds: string[];
   userInfo: User;
}) => {
   await mySetDoc({
      collection: "users",
      data: { song_ids: songIds, song_count: songIds.length } as Partial<User>,
      id: userInfo.email,
   });
};

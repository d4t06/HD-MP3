import {
   deleteObject,
   getDownloadURL,
   ref,
   uploadBytes,
} from "firebase/storage";
import { db, store } from "../firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

type collectionVariant = "songs" | "playlist" | "lyrics" | "users";

const isDev: boolean = import.meta.env.DEV;

export const myDeleteDoc = async ({
   collection,
   id,
   msg,
}: {
   collection: collectionVariant;
   id: string;
   msg?: string;
}) => {
   if (isDev) console.log(msg ?? ">>> api: delete doc");
   await deleteDoc(doc(db, collection, id));
};

export const myGetDoc = async ({
   collection,
   id,
   msg,
}: {
   collection: collectionVariant;
   id: string;
   msg?: string;
}) => {
   if (isDev) console.log(msg ?? ">>> api: get doc");

   return getDoc(doc(db, collection, id));
};

export const mySetDoc = async ({
   collection,
   id,
   data,
   msg,
}: {
   collection: collectionVariant;
   id: string;
   data: {};
   msg?: string;
}) => {
   if (isDev) console.log(msg ?? ">>> api: set doc");

   return await setDoc(doc(db, collection, id), { ...data }, { merge: true });
};

export const uploadFile = async ({
   file,
   folder,
   email,
   msg,
}: {
   file: File;
   folder: "/images/" | "/songs/";
   email: string;
   msg?: string;
}) => {
   if (isDev) console.log(msg ?? ">>> api: upload file");
   const start = Date.now();

   // define ref
   const fileName =
      email.replace("@gmail.com", "") +
      "_" +
      file.name.replaceAll(" ", "").toLowerCase();
   const fileRef = ref(store, `${folder + fileName}`);

   const fileRes = await uploadBytes(fileRef, file);
   const fileURL = await getDownloadURL(fileRes.ref);
   const consuming = (Date.now() - start) / 1000;
   if (isDev) console.log(">>> api: upload file finished after", consuming);

   return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const uploadBlob = async ({
   blob,
   folder,
   songId,
   msg,
}: {
   blob: Blob;
   folder: "/images/" | "/songs/";
   songId: string;
   msg?: string;
}) => {
   if (isDev) console.log(msg ?? "upload blob");
   const start = Date.now();

   // define ref
   // try {
   const fileName = songId + "_stock";
   const fileRef = ref(store, `${folder + fileName}`);
   const fileRes = await uploadBytes(fileRef, blob);
   const fileURL = await getDownloadURL(fileRes.ref);

   const consuming = (Date.now() - start) / 1000;
   if (isDev) console.log(">>> api: upload blob finished after", consuming);

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

   const fileRef = ref(store, filePath);
   await deleteObject(fileRef);
};

export const deleteSong = async (song: Song) => {
   await myDeleteDoc({
      collection: "songs",
      id: song.id,
      msg: ">>> api: delete song doc",
   });

   await deleteFile({
      filePath: song.song_file_path,
      msg: ">>> api: delete song file",
   });

   if (song.lyric_id) {
      await myDeleteDoc({
         collection: "lyrics",
         id: song.lyric_id,
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
   await mySetDoc({
      collection: "playlist",
      data: playlist,
      id: playlist.id,
      msg: ">>> api: set playlist",
   });
};

export const setUserPlaylistIdsDoc = async (
   playlists: Playlist[],
   user: User
) => {
   const newPlaylistIds = playlists.map((playlist) => playlist.id);
   await mySetDoc({
      collection: "users",
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
   await mySetDoc({
      collection: "users",
      data: { song_ids: songIds, song_count: songIds.length } as Partial<User>,
      id: user.email,
      msg: ">>> api: set user song_ids, song_count",
   });
};

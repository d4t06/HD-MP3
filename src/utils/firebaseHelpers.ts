import { Playlist, Song, User } from "../types";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, store } from "../config/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export const myDeleteDoc = async ({
   collection,
   id,
}: {
   collection: "songs" | "playlist" | "lyrics";
   id: string;
}) => {
   console.log('delete doc');

   await deleteDoc(doc(db, collection, id));
};

export const myGetDoc = async ({
   collection,
   id,
}: {
   collection: "songs" | "playlist" | "lyrics";
   id: string;
}) => {
   console.log('get doc');
   
   return getDoc(doc(db, collection, id));
};

export const  mySetDoc =async ({
   collection,
   id,
   data
}: {
   collection: "songs" | "playlist" | "lyrics";
   id: string;
   data: {}
}) => {
   console.log('set doc');

   return setDoc(doc(db, collection, id), {...data}, {merge: true})
}

export const uploadFile = async ({
   file,
   folder,
}: {
   file: File;
   folder: "/images/" | "/songs/";
}) => {
   // define ref
   const fileRef = ref(store, `${folder + file.name}`);
   const fileRes = await uploadBytes(fileRef, file);
   const fileURL = await getDownloadURL(fileRes.ref);

   return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const deleteFile = async ({ filePath }: { filePath: string }) => {
   const fileRef = ref(store, filePath);
   await deleteObject(fileRef);
};

export const deleteSong = async (song: Song) => {
   console.log("deleteSong");

   deleteFile({ filePath: song.song_file_path });

   // Delete the song doc
   await deleteDoc(doc(db, "songs", song.id));

   if (song.lyric_id) {
      // Delete lyric doc
      await deleteDoc(doc(db, "lyrics", song.lyric_id));
   }
};

export const updatePlaylistDoc = async ({ playlist }: { playlist: Playlist }) => {
   console.log("update playlist");

   // Delete the playlist doc
   await setDoc(
      doc(db, "playlist", playlist.id),
      {
         ...playlist,
      },
      { merge: true }
   );
};

export const setUserPlaylistIdsDoc = async (playlists: Playlist[], userData: User) => {
   const userDocRef = doc(db, "users", userData?.email as string);
   const newPlaylistIds = playlists.map((playlist) => playlist.id);

   console.log("set UserPlaylistIdsDoc");
   await setDoc(
      userDocRef,
      {
         playlist_ids: newPlaylistIds,
      },
      { merge: true }
   );
};

export const setUserSongIdsAndCountDoc = async ({
   songIds,
   userData,
}: {
   songIds: string[];
   userData: User;
}) => {
   const userDocRef = doc(db, "users", userData?.email as string);

   console.log("set user doc");

   await setDoc(
      userDocRef,
      {
         song_ids: songIds,
         song_count: songIds.length,
      },
      { merge: true }
   );
};

export const updateSongsListValue = (song: Song, userSongs: Song[]) => {
   const index = userSongs.findIndex((songItem) => songItem.id === song.id);
   userSongs[index] = song;
};

export const updatePlaylistsValue = (playlist: Playlist, playlists: Playlist[]) => {
   const index = playlists.findIndex((playlistItem) => playlistItem.id === playlist.id);
   playlists[index] = playlist;
};

export const countSongsListTimeIds = (
   songsList: Song[]
): { time: number; ids: string[] } => {
   let time: number = 0;
   let ids: string[] = [];

   songsList.forEach((song) => {
      time += song.duration;
      ids.push(song.id);
   });

   return { time, ids };
};
export const generatePlaylistAfterChangeSongs = ({
   newPlaylistSongs,
   existingPlaylist,
}: {
   newPlaylistSongs: Song[];
   existingPlaylist: Playlist;
}) => {
   const { ids, time } = countSongsListTimeIds(newPlaylistSongs);
   const newPlaylist: Playlist = {
      ...existingPlaylist,
      time,
      song_ids: ids,
      count: ids.length,
   };

   return newPlaylist;
};

export const initSongObject = ({ ...value }: Partial<Song>) => {
   const song = {
      name: "",
      singer: "",
      image_url: "",
      song_url: "",
      by: "admin",
      duration: 0,
      lyric_id: "",
      image_file_path: "",
      song_file_path: "",
   };
   return {
      ...song,
      ...value,
   } as Song;
};

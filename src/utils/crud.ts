import { Playlist, Song, User } from "../types";
import { deleteObject, ref } from "firebase/storage";
import { db, store } from "../config/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

export const deleteSong = async (song: Song) => {
   console.log('deleteSong check song', song);

   // Create a reference to the file to delete
   const songFileRef = ref(store, song.file_name);

   // Delete the file
   await deleteObject(songFileRef);

   // Delete the song doc
   await deleteDoc(doc(db, "songs", song.id));

   if (song.lyric_id) {
      // Delete lyric doc
      await deleteDoc(doc(db, "lyrics", song.lyric_id));
   }
};

// playlist
export const delePlaylist = async (playlist: Playlist) => {
   console.log('deleteSong check song', playlist);

   // Delete the playlist doc
   await deleteDoc(doc(db, "playlist", playlist.id));


}


export const setUserPlaylistIdsDoc = async (playlists: Playlist[], userData: User) => {
   const userDocRef = doc(db, "users", userData?.email as string);
   const newPlaylistIds = playlists.map(playlist => playlist.id)

   console.log('updateUserPlaylistIdsDoc check', playlists)
   await setDoc(
      userDocRef,
      {
         playlist_ids: newPlaylistIds,
      },
      { merge: true }
   );

}

export const updateUser = async (songIds: string[], userData: User) => {
   const userDocRef = doc(db, "users", userData?.email as string);

   console.log('updateUser check songIds, userData', { songIds, userData });

   await setDoc(
      userDocRef,
      {
         song_ids: songIds,
         song_count: songIds.length,
      },
      { merge: true }
   );
}


export const updateSongsListValue = (song: Song, userSongs: Song[]) => {
   const index = userSongs.findIndex(songItem => songItem.id === song.id)
   userSongs[index] = song
}

export const updatePlaylistsValue = (playlist: Playlist, playlists: Playlist[]) => {
   const index = playlists.findIndex(playlistItem => playlistItem.id === playlist.id)
   playlists[index] = playlist
}

export const countSongList = (songsList: Song[]): {time: number, ids: string[]} => {
   let time : number = 0;
   let ids : string[] = [];

   songsList.forEach((song) => {
      time += song.duration;
      ids.push(song.id)
   });

   return {time, ids}
}
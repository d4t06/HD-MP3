import { Playlist, Song } from "../types";
import { updatePlaylistsValue } from "./appHelpers";

const removeSongFromPlaylist = (song: Song, playlist: Playlist) => {
   // eliminate 1 song id
   const newPlaylistSongIds = [...playlist.song_ids];
   const index = newPlaylistSongIds.findIndex((item) => item === song.id);
   newPlaylistSongIds.splice(index, 1);

   // update playlist
   const count = newPlaylistSongIds.length;
   const newPlaylist: Playlist = {
      ...playlist,
      count,
      song_ids: newPlaylistSongIds,
      time: count === 0 ? 0 : +(playlist.time - song.duration).toFixed(1),
   };

   console.log("handle playlist prev", playlist.name, playlist.song_ids);

   // check valid playlist
   if (
      newPlaylist.count < 0 ||
      newPlaylist.time < 0 ||
      newPlaylist.song_ids.length === playlist.song_ids.length ||
      newPlaylist.count === playlist.count ||
      newPlaylist.time === playlist.time
   ) {
      return { error: true, newPlaylist };
   }

   console.log("handle playlist current", newPlaylist.name, newPlaylist.song_ids);

   return { error: false, newPlaylist };
};

export const handlePlaylistWhenDeleteManySongs = (
   song: Song,
   playlistsNeedToUpdate: Playlist[],
   newUserPlaylists: Playlist[]
) => {
   let targetPlaylist: Playlist | undefined;

   for (let playlistId of song.in_playlist) {
      // get existing playlist
      const existingIndex = playlistsNeedToUpdate.findIndex((item) => item.id === playlistId);

      const isOnExistingPlaylist = existingIndex !== -1;
      // if existing => use existing
      if (isOnExistingPlaylist) {
         targetPlaylist = playlistsNeedToUpdate[existingIndex];
      } else {
         // else use playlist from user playlist
         const playlist = newUserPlaylists.find((item) => item.id === playlistId);

         if (!playlist) {
            return { error: true };
         }
         targetPlaylist = playlist;
      }

      const { error: newPlaylistError, newPlaylist } = removeSongFromPlaylist(song, targetPlaylist);

      if (newPlaylistError) {
         return { error: true };
      }

      // update playlist to existingPlaylists
      if (isOnExistingPlaylist) {
         console.log("update to existing list ");
         updatePlaylistsValue(newPlaylist, playlistsNeedToUpdate);
      }
      // push to existing list
      else {
         console.log("push to existing list ");

         playlistsNeedToUpdate.push(newPlaylist);
      }
   }

   return { error: false };
};

export const handlePlaylistWhenDeleteSong = async (song: Song, newUserPlaylists: Playlist[]) => {
   let playlistsNeedToUpdateDoc: Playlist[] = [];

   for (let playlistId of song.in_playlist) {
      // determine target playlist in user playlist
      const playlist = newUserPlaylists.find((playlist) => playlist.id === playlistId);
      if (!playlist) return { error: true, playlistsNeedToUpdateDoc };

      // calculate
      const { error, newPlaylist } = removeSongFromPlaylist(song, playlist);
      if (error) return { error: true, playlistsNeedToUpdateDoc };

      playlistsNeedToUpdateDoc.push(newPlaylist);
   }

   return { error: false, playlistsNeedToUpdateDoc };
};

export const handleSongWhenDeleteFromPlaylist = (song: Song, playlist: Playlist) => {
   let newSong: Song | undefined;

   if (!song.in_playlist.length) {
      console.log("No song in playlist");
      return { error: true, newSong };
   }

   const newPlaylistIdsOfSong = [...song.in_playlist];

   // eliminate 1 playlist id
   const index = newPlaylistIdsOfSong.findIndex((id) => id === playlist.id);
   newPlaylistIdsOfSong.splice(index, 1);

   newSong = {
      ...song,
      in_playlist: newPlaylistIdsOfSong,
   };

   // check valid song after change
   if (song.in_playlist.length === newPlaylistIdsOfSong.length) {
      console.log("song in playlist no change");
      return { error: true, newSong };
   }

   return { error: false, newSong };
};

export const handleSongWhenAddToPlaylist = (song: Song, playlist: Playlist) => {
   let newSong: Song | undefined;
   const newPlaylistIdsOfSong = [...song.in_playlist];

   // check for duplicate
   const isAdded = newPlaylistIdsOfSong.find((id) => id === playlist.id);

   if (isAdded) return { error: true, newSong };

   newPlaylistIdsOfSong.push(playlist.id);

   newSong = {
      ...song,
      in_playlist: newPlaylistIdsOfSong,
   };

   // check valid song after change
   if (newPlaylistIdsOfSong.length === song.in_playlist.length) return { error: true, newSong };

   return { error: false, newSong };
};

export const handleSongWhenDeletePlaylist = (playlist: Playlist, playlistSongs: Song[]) => {
   const songsNeedToUpdate: Song[] = [];
   console.log("delete playlist");

   if (!playlist) {
      console.log("no playlist");
      return { error: true, songsNeedToUpdate };
   }

   for (let song of playlistSongs) {
      // check valid
      if (!song.in_playlist.includes(playlist.id)) {
         console.log("not in playlist");

         return {
            error: true,
            songsNeedToUpdate,
         };
      }
      const newPlaylistIdsOfSong = [...song.in_playlist];

      // eliminate 1 playlist id
      const index = newPlaylistIdsOfSong.findIndex((id) => id === playlist.id);
      newPlaylistIdsOfSong.splice(index, 1);

      let newSong = {
         ...song,
         in_playlist: newPlaylistIdsOfSong,
      };

      console.log("check new songs", newSong);

      // check valid after change
      if (newSong.in_playlist.length === song.in_playlist.length) {
         console.log("new song error");
         return { error: true, songsNeedToUpdate };
      }

      songsNeedToUpdate.push(newSong);
   }

   if (songsNeedToUpdate.length === 0) return { error: true, songsNeedToUpdate };

   return { error: false, songsNeedToUpdate };
};

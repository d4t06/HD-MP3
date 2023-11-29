import { Playlist, Song } from "../types";
// import { updatePlaylistsValue } from "./appHelpers";

export const removeSongFromPlaylist = (song: Song, playlist: Playlist) => {
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

   // console.log("handle playlist prev", playlist.name, playlist.song_ids);

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

   // console.log("handle playlist current", newPlaylist.name, newPlaylist.song_ids);

   return { error: false, newPlaylist };
};

import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { initPlaylistObject } from "../utils/appHelpers";

type StateType = {
   currentPlaylist: Playlist;
   playlistSongs: Song[];
};

const initialState: StateType = {
   currentPlaylist: initPlaylistObject({}),
   playlistSongs: [],
};

const currentPlaylistSlice = createSlice({
   name: "currentPlaylist",
   initialState,
   reducers: {
      setCurrentPlaylist(
         state,
         action: PayloadAction<{ playlist: Playlist; songs: Song[] }>
      ) {
         const { playlist, songs } = action.payload;
         state.currentPlaylist = playlist;
         state.playlistSongs = songs;
      },
      updateCurrentPlaylist: (state, action: PayloadAction<Partial<Playlist>>) => {
         const payload = action.payload;

         Object.assign(state.currentPlaylist, payload);
      },
      addSongsAndUpdateCurrent(state, action: PayloadAction<{ songs: Song[] }>) {
         const { songs } = action.payload;
         const newSongs = songs.map(
            (s) => ({ ...s, song_in: `playlist_${state.currentPlaylist.id}` } as Song)
         );

         console.log("current", current(state.playlistSongs).map((s) => s.id));

         console.log(
            "add playlist songs",
            songs.map((s) => s.id)
         );

         state.playlistSongs.push(...newSongs);
         state.currentPlaylist.song_ids.push(...songs.map((s) => s.id));
      },
      setPlaylistSongs(state, action: PayloadAction<{ songs: Song[] }>) {
         const { songs } = action.payload;
         state.playlistSongs = songs;
      },
      removeSong(state, action: PayloadAction<{ index: number }>) {
         const { index } = action.payload;
         state.playlistSongs.splice(index, 1);
      },
      setPlaylistSongsAndUpdateCurrent(state, action: PayloadAction<{ songs: Song[] }>) {
         const { songs } = action.payload;

         console.log("current", current(state.playlistSongs).map((s) => s.id));

         console.log(
            "set playlist songs",
            songs.map((s) => s.id)
         );

         state.playlistSongs = songs;
         state.currentPlaylist.song_ids = songs.map((s) => s.id);
      },
      resetCurrentPlaylist: (state: StateType) => {
         state.currentPlaylist = initialState.currentPlaylist;
         state.playlistSongs = initialState.playlistSongs;
      },
   },
});

export const selectCurrentPlaylist = (state: { currentPlaylist: StateType }) =>
   state.currentPlaylist;
export const {
   addSongsAndUpdateCurrent,
   removeSong,
   setCurrentPlaylist,
   updateCurrentPlaylist,
   resetCurrentPlaylist,
   setPlaylistSongs,
   setPlaylistSongsAndUpdateCurrent,
} = currentPlaylistSlice.actions;
export default currentPlaylistSlice.reducer;

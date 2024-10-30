import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
  currentPlaylist: Playlist | null;
  playlistSongs: Song[];
};

const initialState: StateType = {
  currentPlaylist: null,
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
      if (!state.currentPlaylist) return state;
      Object.assign(state.currentPlaylist, action.payload);
    },
    addSongsToPlaylist(state, action: PayloadAction<Song[]>) {
      if (!state.currentPlaylist) return state;

      const newSongs = action.payload.map(
        (s) => ({ ...s, song_in: `playlist_${state.currentPlaylist!.id}` } as Song)
      );
      state.playlistSongs.push(...newSongs);
    },
    setPlaylistSong(state, action: PayloadAction<Song[]>) {
      state.playlistSongs = action.payload;
    },
    removeSong(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      state.playlistSongs.splice(index, 1);
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
  addSongsToPlaylist,
  removeSong,
  setCurrentPlaylist,
  updateCurrentPlaylist,
  resetCurrentPlaylist,
  setPlaylistSong,
} = currentPlaylistSlice.actions;
export default currentPlaylistSlice.reducer;

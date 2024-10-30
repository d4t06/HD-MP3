import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = {
  initial: boolean;
  adminSongs: Song[];
  userSongs: Song[];
  adminPlaylists: Playlist[];
  userPlaylists: Playlist[];
};

const initialState: StateType = {
  initial: false,
  adminPlaylists: [],
  adminSongs: [],
  userPlaylists: [],
  userSongs: [],
};

const songPlaylistSlice = createSlice({
  name: "songPlaylist",
  initialState,
  reducers: {
    initSongAndPlaylist: (
      state: StateType,
      action: PayloadAction<Partial<StateType>>
    ) => {
      const payload = action.payload;

      Object.assign(state, { ...payload, initial: true });
    },
    setUserPlaylists: (
      state: StateType,
      action: PayloadAction<{ playlists: Playlist[] }>
    ) => {
      const { playlists } = action.payload;
      state.userPlaylists = playlists;
    },
    setUserSongs: (state: StateType, action: PayloadAction<{ songs: Song[] }>) => {
      const { songs } = action.payload;
      state.userSongs = songs;
    },
    addUserSong: (state: StateType, action: PayloadAction<{ song: Song }>) => {
      const { song } = action.payload;

      state.userSongs.push(song);
    },
    updateUserSong: (state: StateType, action: PayloadAction<{ song: Song }>) => {
      const { song } = action.payload;

      const index = state.userSongs.findIndex((s) => s.id === song.id);
      if (index === -1) return;

      Object.assign(state.userSongs[index], song);
    },
    addUserPlaylist: (
      state: StateType,
      action: PayloadAction<{ playlist: Playlist }>
    ) => {
      const { playlist } = action.payload;

      state.userPlaylists.push(playlist);
    },
    updateUserPlaylist: (state: StateType, action: PayloadAction<{ playlist: Song }>) => {
      const { playlist } = action.payload;

      const index = state.userPlaylists.findIndex((p) => p.id === playlist.id);
      if (index === -1) return;

      Object.assign(state.userPlaylists[index], playlist);
    },
    resetSongPlaylist: (state: StateType) => {
      Object.assign(state, initialState);
    },
  },
});

export const selectSongPlaylist = (state: { songPlaylist: StateType }) =>
  state.songPlaylist;

export const {
  initSongAndPlaylist,
  addUserPlaylist,
  addUserSong,
  resetSongPlaylist,
  updateUserPlaylist,
  updateUserSong,
  setUserSongs,
  setUserPlaylists,
} = songPlaylistSlice.actions;

export default songPlaylistSlice.reducer;

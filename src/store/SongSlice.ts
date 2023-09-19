import { createSlice } from "@reduxjs/toolkit";
import { Playlist, Song } from "../types";

type Status = {
  currentIndex: number,
  song_in: 'user' | 'admin' | `${'user-playlist-'}${string}` | `${'admin-playlist-'}${string}`
  
}

type stateType = {
  song: Song & Status;
  playlist: Playlist;
}

const init: stateType = {
  song: {
    id: '',
    name: "",
    singer: "",
    file_name: '',
    image_path: "",
    song_path: "",
    by: "",
    duration: 0,
    lyric_id: "",
    currentIndex: 0,
    song_in: "admin"
  },
  playlist: {
    id: '',
    image_path: '',
    name: '',
    song_ids: [],
    time: 0,
    count: 0,
    by: ''
  },
};

const SongSlice = createSlice({
  name: "song",
  initialState: init,
  reducers: {
    setSong(state, action: {type: string; payload: Song & Status }) {
      state.song = { ...action.payload };
    },

    setPlaylist(state, action: { type: string; payload: Playlist }) {
      state.playlist = { ...action.payload }
    }
  },
});

export const selectAllSongStore = (state: { song: stateType }) => state.song;

export const { setSong, setPlaylist } = SongSlice.actions;

export default SongSlice.reducer;

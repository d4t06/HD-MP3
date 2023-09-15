import { createSlice } from "@reduxjs/toolkit";
import { Playlist, Song } from "../types";

type stateType = {
  song: Song & { currentIndex: number };
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
    setSong(state, action) {
      const actionPayload = action.payload as Song & { currentIndex: number };

      state.song = { ...actionPayload };
    },

    setPlaylist(state, action: { type: string; payload: Playlist }) {      
      state.playlist = { ...action.payload }
    }
  },
});

export const selectAllSongStore = (state: { song: stateType }) => state.song;

export const { setSong, setPlaylist } = SongSlice.actions;

export default SongSlice.reducer;

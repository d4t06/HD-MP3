import { createSlice } from "@reduxjs/toolkit";
import { Playlist, Song } from "../types";

export type Status = {
  currentIndex: number;
  song_in:
    | "user"
    | "admin"
    | `${"user-playlist-"}${string}`
    | `${"admin-playlist-"}${string}`
    | "";
};

type stateType = {
  song: Song & Status;
  playlist: Playlist;
};

const init: stateType = {
  song: {
    id: "",
    name: "",
    singer: "",
    by: "",
    image_file_path: "",
    image_url: "",
    song_file_path: "",
    song_url: "",
    duration: 0,
    lyric_id: "",
    currentIndex: 0,
    song_in: "",
    in_playlist: [],
    blurhash_encode: "",
  },
  playlist: {
    id: "",
    name: "",
    song_ids: [],
    time: 0,
    count: 0,
    by: "",
    image_by: "",
    image_file_path: "",
    image_url: "",
    blurhash_encode: "",
  },
};

const SongSlice = createSlice({
  name: "song",
  initialState: init,
  reducers: {
    setSong(state, action: { type: string; payload: (Song & Status) | undefined }) {
      state.song = action.payload ? action.payload : init.song;
    },

    setPlaylist(state, action: { type: string; payload: Playlist }) {
      state.playlist = { ...action.payload };
    },
  },
});

export const selectAllSongStore = (state: { song: stateType }) => state.song;

export const { setSong, setPlaylist } = SongSlice.actions;

export default SongSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { Playlist, Song } from "../types";
import { initSongObject } from "../utils/appHelpers";

export type SongIn = "" | "favorite" | "admin" | "user" | `playlist_${string}`;

export type SongWithSongIn = Song & { song_in: SongIn };

export type Status = {
   currentIndex: number;
};

type stateType = {
   song: SongWithSongIn & Status;
   playlist: Playlist;
};

let initSongState: SongWithSongIn & Status = { ...initSongObject({}), currentIndex: 0, song_in: "" };

const hd_mp3 = JSON.parse(localStorage.getItem("hdmp3") || JSON.stringify({ songs: [], current: "" })) as {
   songs: SongWithSongIn[];
   current: string;
};

if (hd_mp3.songs) {
   hd_mp3.songs.forEach((s, index) => {
      if (s.id === hd_mp3.current) {
         initSongState = { ...s, currentIndex: index };
      }
   });
}

const init: stateType = {
   song: initSongState,
   playlist: {
      id: "",
      name: "",
      song_ids: [],
      time: 0,
      count: 0,
      by: "",
      image_url: "",
      blurhash_encode: "",
   },
};

const SongSlice = createSlice({
   name: "song",
   initialState: init,
   reducers: {
      setSong(state, action: { type: string; payload: (SongWithSongIn & Status) | undefined }) {
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

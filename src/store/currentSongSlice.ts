import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage, initSongObject } from "../utils/appHelpers";

export type Status = {
   currentIndex: number;
};

export type SongStore = SongWithSongIn & Status;

type StateType = {
   currentSong: SongStore;
   // playlist: Playlist;
};

const storage = getLocalStorage();

let initSongState: SongWithSongIn & Status = storage["current"] || {
   ...initSongObject({}),
   currentIndex: 0,
   song_in: "",
};

// const hd_mp3 = JSON.parse(localStorage.getItem("hdmp3") || JSON.stringify({ songs: [], current: "" })) as {
//    songs: SongWithSongIn[];
//    current: string;
// };

// if (storage?.songs) {
//    (storage.songs as SongWithSongIn[]).forEach((s, index) => {
//       if (s.id === storage?.current) {
//          initSongState = { ...s, currentIndex: index };
//       }
//    });
// }

const init: StateType = {
   currentSong: initSongState,
};

const SongSlice = createSlice({
   name: "currentSong",
   initialState: init,
   reducers: {
      setSong(state, action: { type: string; payload: SongWithSongIn & Status }) {
         state.currentSong = action.payload;
      },

      updateSong: (state: StateType, action: PayloadAction<Partial<SongWithSongIn>>) => {
         const payload = action.payload;
         Object.assign(state.currentSong, payload);
      },

      resetCurrentSong: (state: StateType) => {
         state.currentSong = {
            ...initSongObject({}),
            currentIndex: 0,
            song_in: "",
         };
      },
   },
});

export const selectCurrentSong = (state: { currentSong: StateType }) => state.currentSong;

export const { setSong, resetCurrentSong, updateSong } = SongSlice.actions;

export default SongSlice.reducer;

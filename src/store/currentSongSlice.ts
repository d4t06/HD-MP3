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

const init: StateType = {
   currentSong: initSongState,
};

const SongSlice = createSlice({
   name: "currentSong",
   initialState: init,
   reducers: {
      setSong(
         state,
         action: { type: string; payload: SongWithSongIn & Status }
      ) {
         state.currentSong = action.payload;
      },

      updateSong: (
         state: StateType,
         action: PayloadAction<Partial<SongWithSongIn>>
      ) => {
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

export const selectCurrentSong = (state: { currentSong: StateType }) =>
   state.currentSong;

export const { setSong, resetCurrentSong, updateSong } = SongSlice.actions;

export default SongSlice.reducer;

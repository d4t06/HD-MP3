import { createSlice } from "@reduxjs/toolkit";

type Repeat = "one" | "all" | "no";

type stateType = {
   playStatus: {
      isPlaying: boolean;
      isWaiting: boolean;
      isError: boolean;
      isRepeat: Repeat;
      isShuffle: boolean;
      isLoaded: boolean;
      isTimer: number;
   };
};

// init {
// playStatus: {
//     isRepeatPlaylist: boolean;
// }
// }

// not define, dispatch set state don't work

// init {
// isRepeatPlaylist: boolean;
// }

const init: stateType = {
   playStatus: {
      isError: false,
      isPlaying: false,
      isWaiting: false,
      isLoaded: true,
      isRepeat: (localStorage.getItem("isRepeat") || "no") as Repeat,
      isShuffle: JSON.parse(localStorage.getItem("isShuffle") || "false"),
      isTimer: JSON.parse(localStorage.getItem("isTimer") || "0"),
   },
};

const PlayStatusSlice = createSlice({
   name: "playStatus",
   initialState: init,
   reducers: {
      setPlayStatus(state, action: { type: string; payload: Partial<stateType["playStatus"]> }) {
         state.playStatus = { ...state.playStatus, ...action.payload };
      },
   },
});

// state ở đây là tất cả cá slice được thêm vào reducer (xem file store)
export const selectAllPlayStatusStore = (state: { playStatus: stateType }) => state.playStatus;

export const { setPlayStatus } = PlayStatusSlice.actions;

export default PlayStatusSlice.reducer;

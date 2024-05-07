import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../utils/appHelpers";

type Repeat = "one" | "all" | "no";
type LyricSize = "small" | "medium" | "large";

type stateType = {
   playStatus: {
      isPlaying: boolean;
      isWaiting: boolean;
      isError: boolean;
      lyricSize: LyricSize;
      isRepeat: Repeat;
      isShuffle: boolean;
      isLoaded: boolean;
      isTimer: number;
      isCrossFade: boolean;
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

const init = () => {
   const storage = getLocalStorage();

   const state: stateType = {
      playStatus: {
         isError: false,
         isPlaying: false,
         isWaiting: false,
         lyricSize: (storage["lyricSize"] || "medium") as LyricSize,
         isLoaded: true,
         isRepeat: (storage["isRepeat"] || "no") as Repeat,
         isShuffle: storage["isShuffle"] || false,
         isTimer: storage["isTimer"] || 0,
         isCrossFade: storage["isCrossFade"] || false,
      },
   };

   return state;
};

const PlayStatusSlice = createSlice({
   name: "playStatus",
   initialState: () => init(),
   reducers: {
      setPlayStatus(
         state,
         action: { type: string; payload: Partial<stateType["playStatus"]> }
      ) {
         state.playStatus = { ...state.playStatus, ...action.payload };
      },
   },
});

// state ở đây là tất cả cá slice được thêm vào reducer (xem file store)
export const selectAllPlayStatusStore = (state: { playStatus: stateType }) =>
   state.playStatus;

export const { setPlayStatus } = PlayStatusSlice.actions;

export default PlayStatusSlice.reducer;

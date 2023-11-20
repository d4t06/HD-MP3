import { createSlice } from "@reduxjs/toolkit";

type stateType = {
   playStatus: {
      isPlaying: boolean;
      isWaiting: boolean;
      isError: boolean;
      isRepeat: 'one' | 'all' | 'no';
      isShuffle: boolean;
      isLoaded: boolean;
      isTimer: number
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
      isRepeat: 'no',
      isShuffle: false,
      isTimer: 0,
   },
};

const PlayStatusSlice = createSlice({
   name: "playStatus",
   initialState: init,
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

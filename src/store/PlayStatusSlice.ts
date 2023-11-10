import { createSlice } from "@reduxjs/toolkit";

type stateType = {
  playStatus: {
    isRepeatPlaylist: boolean;
    isPlaying: boolean;
    isWaiting: boolean;
    isError: boolean;
    isRepeat: boolean;
    isShuffle: boolean;
    isLoaded: boolean;
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
    isRepeatPlaylist: false,
    isError: false,
    isPlaying: false,
    isWaiting: false,
    isLoaded: true,
    isRepeat: JSON.parse(localStorage.getItem("repeat") || "false"),
    isShuffle: JSON.parse(localStorage.getItem("shuffle") || "false"),
  },
};

const PlayStatusSlice = createSlice({
  name: "playStatus",
  initialState: init,
  reducers: {
    setPlayStatus(state, action: { type: string; payload: Partial<stateType['playStatus']> }) {
      // console.log('check state', 'check payload', action.payload, {...state});

      state.playStatus = { ...state.playStatus, ...action.payload };
    },
  },
});

// state ở đây là tất cả cá slice được thêm vào reducer (xem file store)
export const selectAllPlayStatusStore = (state: { playStatus: stateType }) =>
  state.playStatus;

export const { setPlayStatus } = PlayStatusSlice.actions;

export default PlayStatusSlice.reducer;

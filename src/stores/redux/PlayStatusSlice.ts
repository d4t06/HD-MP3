import { createSlice } from "@reduxjs/toolkit";

// type Repeat = "one" | "all" | "no";
// type LyricSize = "small" | "medium" | "large";

export type PlayStatus = "playing" | "error" | "loading" | "paused" | "waiting";

type StateType = {
  /** update 23/10/2024 */
  playStatus: PlayStatus;
  // triggerPlayStatus: PlayStatus | "";
  isLoaded: boolean;
  countDown: number
};

const init = () => {
  const state: StateType = {
    playStatus: "paused",
    // triggerPlayStatus: "",
    isLoaded: true,
    countDown: 0
  };

  return state;
};

const PlayStatusSlice = createSlice({
  name: "playStatus",
  initialState: () => init(),
  reducers: {
    setPlayStatus(state, action: { type: string; payload: Partial<StateType> }) {
      Object.assign(state, action.payload);
    },
  },
});

// state ở đây là tất cả cá slice được thêm vào reducer (xem file stores)
export const selectAllPlayStatusStore = (state: { playStatus: StateType }) =>
  state.playStatus;

export const { setPlayStatus } = PlayStatusSlice.actions;

export default PlayStatusSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../utils/appHelpers";

type Repeat = "one" | "all" | "no";
type LyricSize = "small" | "medium" | "large";

type StateType = {
  playStatus: {
    isPlaying: boolean;
    isWaiting: boolean;
    isError: boolean;
    lyricSize: LyricSize;
     isRepeat: Repeat;
     isShuffle: boolean;
    isLoaded: boolean;
    //  isTimer: number;
    isCrossFade: boolean;
    songBackground: boolean;
    songImage: boolean;
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

  const state: StateType = {
    playStatus: {
      isError: false,
      isPlaying: false,
      isWaiting: false,
      lyricSize: (storage["lyricSize"] || "medium") as LyricSize,
      isLoaded: true,
      isRepeat: (storage["isRepeat"] || "no") as Repeat,
      isShuffle: storage["isShuffle"] || false,
      // isTimer: 0,
      isCrossFade: storage["isCrossFade"] || false,
      songBackground: storage["songBackground"] || false,
      songImage: storage["songImage"] || false,
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
      action: { type: string; payload: Partial<StateType["playStatus"]> }
    ) {
      state.playStatus = { ...state.playStatus, ...action.payload };
    },
    togglePlayControl(
      state: StateType,
      action: PayloadAction<{ variant: keyof StateType["playStatus"] }>
    ) {
      const { variant } = action.payload;

      switch (variant) {
        default:
          if (typeof state.playStatus[variant] === "boolean") {
            const value = !state.playStatus[variant] as boolean;
            (state.playStatus[variant] as boolean) = value;
            setLocalStorage(variant, value);
          }
      }
    },
  },
});

// state ở đây là tất cả cá slice được thêm vào reducer (xem file store)
export const selectAllPlayStatusStore = (state: { playStatus: StateType }) =>
  state.playStatus;

export const { setPlayStatus, togglePlayControl } = PlayStatusSlice.actions;

export default PlayStatusSlice.reducer;

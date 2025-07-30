import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
  queueSongs: Song[];
  currentQueueId: string | null;
  currentSongData: { song: Song; index: number } | null;
  isFetching: boolean;
};

// get current from store, fix clear queue button
// const queue = getLocalStorage()["queue"] || [];
const initialState: StateType = {
  queueSongs: getLocalStorage()["queue"] || [],
  /** update queue id in use control */
  currentQueueId: null,
  currentSongData: null,
  isFetching: false,
};

function updateCurrentSongData(state: StateType) {
  for (let index = 0; index < state.queueSongs.length; index++) {
    const song = state.queueSongs[index];
    if (song.queue_id === state.currentQueueId) {
      state.currentSongData = { song, index };
      return;
    }
  }

  state.currentSongData = null;
}

const songQueueSlice = createSlice({
  name: "songQueue",
  initialState,
  reducers: {
    setQueue(state: StateType, action: PayloadAction<{ songs: Song[] }>) {
      const songs = action.payload.songs;
      state.queueSongs = songs;

      updateCurrentSongData(state);
      setLocalStorage("queue", songs);
    },
    setCurrentQueueId(state: StateType, action: PayloadAction<string>) {
      const id = action.payload;
      state.currentQueueId = id;
      updateCurrentSongData(state);
      // update in use control
      // setLocalStorage("current_queue_id", id);
    },
    removeSongFromQueue(
      state: StateType,
      action: PayloadAction<{ index: number }>,
    ) {
      const { index } = action.payload;

      state.queueSongs.splice(index, 1);
      setLocalStorage("queue", state.queueSongs);

      if (state.currentSongData)
        if (index <= state.currentSongData.index) {
          updateCurrentSongData(state);
        }
    },

    setIsFetchingRecommend(state: StateType, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },

    addSongToQueue: (
      state: StateType,
      action: PayloadAction<{ songs: Song[] }>,
    ) => {
      const _songs = action.payload.songs;

      state.queueSongs.push(..._songs);
      state.isFetching = false;

      setLocalStorage("queue", state.queueSongs);
    },
    resetSongQueue: (state: StateType) => {
      setLocalStorage("queue", []);
      Object.assign(state, { ...initialState, queueSongs: [] });
    },
  },
});

export const selectSongQueue = (state: { songQueue: StateType }) =>
  state.songQueue;

export const {
  addSongToQueue,
  setCurrentQueueId,
  removeSongFromQueue,
  setQueue,
  resetSongQueue,
  setIsFetchingRecommend,
} = songQueueSlice.actions;

export default songQueueSlice.reducer;

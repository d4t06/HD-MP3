import { setLocalStorage } from "@/utils/appHelpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";

type StateType = {
  queueSongs: Song[];
  currentQueueId: string | null;
  currentSongData: { song: Song; index: number } | null;
};

// const storage = getLocalStorage();

const initialState: StateType = {
  // queueSongs: storage["queue"] || [],
  queueSongs: [],
  currentQueueId: null,
  currentSongData: null,
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
      state.queueSongs = action.payload.songs;
      setLocalStorage("queue", action.payload.songs);

      updateCurrentSongData(state);
    },
    setCurrentQueueId(state: StateType, action: PayloadAction<string>) {
      state.currentQueueId = action.payload;
      updateCurrentSongData(state);
    },
    removeSongFromQueue(state: StateType, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;

      state.queueSongs.splice(index, 1);
      setLocalStorage("queue", state.queueSongs);

      if (state.currentSongData)
        if (index <= state.currentSongData.index) {
          updateCurrentSongData(state);
        }
    },

    addSongToQueue: (state: StateType, action: PayloadAction<{ songs: Song[] }>) => {
      state.queueSongs.push(...action.payload.songs);
      setLocalStorage("queue", action.payload.songs);
    },
    resetSongQueue: (state: StateType) => {
      Object.assign(state, initialState);
    },
  },
});

export const selectSongQueue = (state: { songQueue: StateType }) => state.songQueue;

export const {
  addSongToQueue,
  setCurrentQueueId,
  removeSongFromQueue,
  setQueue,
  resetSongQueue,
} = songQueueSlice.actions;

export default songQueueSlice.reducer;

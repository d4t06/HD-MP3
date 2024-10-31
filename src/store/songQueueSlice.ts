import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

type StateType = {
  queueSongs: QueueSong[];
  current_id: string | null;
};

const storage = getLocalStorage();

const initialState: StateType = {
  queueSongs: storage["queue"] || [],
  current_id: null,
};

const getQueueSongs = (songs: Song[]) =>
  songs.map((s) => {
    return { ...s, queue_id: nanoid(4) } as QueueSong;
  });

const songQueueSlice = createSlice({
  name: "songQueue",
  initialState,
  reducers: {
    setQueue: (state: StateType, action: PayloadAction<{ songs: Song[] }>) => {
      const { songs } = action.payload;

      const queueSongs = getQueueSongs(songs);

      state.queueSongs = queueSongs;

      setLocalStorage("queue", state.queueSongs);
    },
    removeSongFromQueue: (state: StateType, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;

      // update songs
      // const indexList: number[] = [];
      // state.queueSongs.forEach((s, index) => {
      //    if (s.id === id) indexList.push(index);
      // });

      // indexList.forEach((index) => {
      //    state.queueSongs.splice(index, 1);
      // });

      state.queueSongs.splice(index, 1);

      // update local storage
      setLocalStorage("queue", state.queueSongs);

      // update from
      // const newSongFrom: StateType["from"] = [];
      // state.queueSongs.forEach((s) => {
      //   if (!newSongFrom.includes(s.song_in)) {
      //     newSongFrom.push(s.song_in);
      //   }
      // });

      // state.from = newSongFrom;
    },
    addSongToQueue: (state: StateType, action: PayloadAction<{ songs: Song[] }>) => {
      const { songs } = action.payload;

      // // only can add songs from same place
      // if (!state.from.includes(songs[0].song_in)) {
      //   state.from.push(songs[0].song_in);
      // }

      const queueSongs = getQueueSongs(songs);

      state.queueSongs.push(...queueSongs);
      setLocalStorage("queue", state.queueSongs);
    },
    updateSongInQueue: (state: StateType) => {
      // const { song } = action.payload;
      return state;
      // const index = state.queueSongs.findIndex((s) => s.id === song.id);

      // Object.assign(state.queueSongs[index], song);
    },
    resetSongQueue: (state: StateType) => {
      state.queueSongs = [];
      setLocalStorage("queue", []);
    },
  },
});

export const selectSongQueue = (state: { songQueue: StateType }) => state.songQueue;

export const {
  addSongToQueue,
  updateSongInQueue,
  removeSongFromQueue,
  setQueue,
  resetSongQueue,
} = songQueueSlice.actions;

export default songQueueSlice.reducer;

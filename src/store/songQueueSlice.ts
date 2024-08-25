import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
   queueSongs: SongWithSongIn[];
   from: SongIn[];
};

const storage = getLocalStorage();

const initialState: StateType = {
   queueSongs: storage["queue"] || [],
   from: [],
};

const songQueueSlice = createSlice({
   name: "songQueue",
   initialState,
   reducers: {
      setQueue: (
         state: StateType,
         action: PayloadAction<{ songs: SongWithSongIn[] }>
      ) => {
         const { songs } = action.payload;

         state.queueSongs = songs;
         state.from = [songs[0].song_in];

         setLocalStorage("queue", state.queueSongs);
      },
      removeSongFromQueue: (
         state: StateType,
         action: PayloadAction<{ index: number }>
      ) => {
         const { index } = action.payload;
         const [removedSong] = state.queueSongs.splice(index, 1);

         setLocalStorage("queue", state.queueSongs);

         const fromIndex = state.from.findIndex((sIn) => sIn === removedSong.song_in);
         if (fromIndex !== -1) {
            state.from.slice(index, 1);
         }
      },
      addSongToQueue: (
         state: StateType,
         action: PayloadAction<{ songs: SongWithSongIn[] }>
      ) => {
         const { songs } = action.payload;
         if (!state.from.includes(songs[0].song_in)) {
            state.from.push(songs[0].song_in);
         }

         state.queueSongs.push(...songs);
         setLocalStorage("queue", state.queueSongs);
      },
      updateSongInQueue: (
         state: StateType,
         action: PayloadAction<{ song: SongWithSongIn }>
      ) => {
         const { song } = action.payload;
         const index = state.queueSongs.findIndex((s) => s.id === song.id);

         Object.assign(state.queueSongs[index], song);
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

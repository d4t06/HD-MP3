import { configureStore } from "@reduxjs/toolkit";
import currentSongReducer from "./currentSongSlice";
import playStatusReducer from "./PlayStatusSlice";
import currentPlaylistReducer from "./currentPlaylistSlice";
import songQueueReducer from "./songQueueSlice";

const store = configureStore({
   reducer: {
      currentSong: currentSongReducer,
      currentPlaylist: currentPlaylistReducer,
      playStatus: playStatusReducer,
      songQueue: songQueueReducer,
   },
});

export default store;

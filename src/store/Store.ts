import { configureStore } from "@reduxjs/toolkit";
import playStatusReducer from "./PlayStatusSlice";
import currentPlaylistReducer from "./currentPlaylistSlice";
import songQueueReducer from "./songQueueSlice";

const store = configureStore({
   reducer: {
      currentPlaylist: currentPlaylistReducer,
      playStatus: playStatusReducer,
      songQueue: songQueueReducer,
   },
});

export default store;

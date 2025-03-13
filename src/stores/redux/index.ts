import { configureStore } from "@reduxjs/toolkit";
import playStatusReducer from "./PlayStatusSlice";
import currentPlaylistReducer from "./currentPlaylistSlice";
import songQueueReducer from "./songQueueSlice";

const reduxStore = configureStore({
  reducer: {
    currentPlaylist: currentPlaylistReducer,
    playStatus: playStatusReducer,
    songQueue: songQueueReducer,
  },
  //   fix fireStore timestamp error
  middleware: (cb) => cb({ serializableCheck: false }),
});

export default reduxStore;

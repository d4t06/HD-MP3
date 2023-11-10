import { configureStore } from "@reduxjs/toolkit";
import SongReducer from "./SongSlice";
import PlayStatusSlice from "./PlayStatusSlice";

const store = configureStore({
   reducer: {
      song: SongReducer,
      playStatus: PlayStatusSlice
   }
})

export default store
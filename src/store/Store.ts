import { configureStore } from "@reduxjs/toolkit";
import SongReducer from "./SongSlice";

const store = configureStore({
   reducer: {
      song: SongReducer,
   }
})

export default store
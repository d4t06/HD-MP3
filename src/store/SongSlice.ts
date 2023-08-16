import { createSlice } from "@reduxjs/toolkit";
import { Song } from "../types";

const init = {
   song: {
      name: '',
      singer: '',
      path: '',
      image: '',
      currentIndex: 0,
   } as Song,
   status: {
      playing: '',
      repeat: '',
      random: '',
   }
}

const SongSlice = createSlice({
   name: 'song',
   initialState: init,
   reducers: {
      setSong(state, action) {
         const actionPayload = action.payload as Song;
         state.song.image = actionPayload.image
         state.song.path = actionPayload.path
         state.song.name = actionPayload.name
         state.song.singer = actionPayload.singer
         state.song.currentIndex = actionPayload.currentIndex
      }
   }
})

export const selectAllSongStore = (state: any) => state.song as {song : Song}

export const {setSong} = SongSlice.actions

export default SongSlice.reducer;
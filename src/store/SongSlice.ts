import { createSlice } from "@reduxjs/toolkit";
import { Song } from "../types";

const init = {
  song: {
    name: "",
    singer: "",
    image_path: "",
    song_path: "",
    by: "",
    duration: 0,
    lyric_id: "",
    currentIndex: 0,
  } as Song & { currentIndex: number },
};

const SongSlice = createSlice({
  name: "song",
  initialState: init,
  reducers: {
    setSong(state, action) {
      const actionPayload = action.payload as Song & { currentIndex: number };

      state.song = { ...actionPayload };
    },
  },
});

export const selectAllSongStore = (state: any) =>
  state.song as { song: Song & { currentIndex: number } };

export const { setSong } = SongSlice.actions;

export default SongSlice.reducer;

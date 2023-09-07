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
      state.song.image_path = actionPayload.image_path;
      state.song.song_path = actionPayload.song_path;
      state.song.name = actionPayload.name;
      state.song.singer = actionPayload.singer;
      state.song.currentIndex = actionPayload.currentIndex;
      state.song.lyric_id = actionPayload.lyric_id;
      state.song.id = actionPayload.id;
    },
  },
});

export const selectAllSongStore = (state: any) =>
  state.song as { song: Song & { currentIndex: number } };

export const { setSong } = SongSlice.actions;

export default SongSlice.reducer;

import { Timestamp } from "firebase/firestore";

export type User = {
  display_name: string;
  email: string;
  photoURL: string;
  songs: string[];
  playlist_ids: string[];
  role: string;
  songs_count: number;
  latest_seen:Timestamp;
};

export type Song = {
   id: string,
  name: string;
  singer: string;
  image_path: string;
  file_name: string;
  song_path: string;
  by: string;
  duration: number;
  lyric_id: string;
};
export type ParserSong = {
  name: string;
  singer: string;
  lyric: string;
};

export type Playlist = {
  id: string,
  name: string;
  image_path: string;
  song_ids: Array<string>;
  time: number;
  count: number;
  by: string;
}

export type Lyric = {
  base: string;
  real_time: RealTimeLyric[];
};

export interface RealTimeLyric {
  start: number;
  end: number;
  text: string;
}

export type ThemeKeyType = "red" | "green_light" | "deep_blue";

export type ThemeType = {
  id: string;
  type: string;
  bottom_player_bg: string;
  side_bar_bg: string;
  container: string;
  content_text: string;
  content_hover_text: string;
  content_bg: string;
  content_hover_bg: string;
};

export type ThemesType = Record<"red" | "green_light" | "deep_blue", ThemeType>;

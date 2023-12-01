import { Timestamp } from "firebase/firestore";

export type User = {
  display_name: string;
  email: string;
  photoURL: string;
  playlist_ids: string[];
  song_ids: string[];
  like_song_ids: string[];
  play_history: string[];
  role: string;
  song_count: number;
  latest_seen: Timestamp;
};

export type Song = {
  id: string;
  name: string;
  singer: string;
  image_url: string;
  image_file_path: string;
  song_url: string;
  song_file_path: string;
  by: string;
  duration: number;
  lyric_id: string;
  blurhash_encode: string;
};

export type ParserSong = {
  name: string;
  singer: string;
  lyric: string;
};

export type Playlist = {
  id: string;
  name: string;
  image_url: string;
  blurhash_encode: string;
  song_ids: Array<string>;
  time: number;
  count: number;
  by: "admin" | string;
};

export type Lyric = {
  id: string;
  base: string;
  real_time: RealTimeLyric[];
};

export interface RealTimeLyric {
  start: number;
  end: number;
  text: string;
}

export type ThemeKeyType =
  | "red"
  | "green_light"
  | "deep_blue"
  | "gray"
  | "white"
  | "black";

export type ThemeType = {
  name: string;
  id: ThemeKeyType;
  type: "light" | "dark";
  bottom_player_bg: string;
  side_bar_bg: string;
  container: string;
  content_text: string;
  content_hover_text: string;
  content_border: string;
  content_hover_border: string;
  content_bg: string;
  content_hover_bg: string;
};

export type Toast = {
  title?: "success" | "error" | "warning";
  desc: string;
  id: string;
};

export type ModalName = "confirm" | "edit" | "setting";

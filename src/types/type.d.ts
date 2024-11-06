type Location = "admin-songs" | "my-song" | "my-playlist" | "admin-playlist";

type User = {
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

type SongIn = "" | "favorite" | "admin" | "user" | `playlist_${string}`;

type Song = {
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
  size: number;
  song_in: SongIn;
  queue_id: string;
};

type ParserSong = {
  name: string;
  singer: string;
  lyric: string;
};

type Playlist = {
  id: string;
  name: string;
  image_url: string;
  blurhash_encode: string;
  song_ids: Array<string>;
  by: "admin" | string;
};

type SongLyric = {
  id: string;
  base: string;
  real_time: RealTimeLyric[];
};

type LyricTune = {
  grow: string;
  end: number;
};

interface RealTimeLyric {
  start: number;
  end: number;
  text: string;
  tune?: string;
}

type ThemeKeyType = "red" | "green_light" | "deep_blue" | "gray" | "white" | "black";

type ThemeType = {
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
  content_code: string;
  container_code: string;
  content_hover_bg: string;
  text_color: string;
};

type Toast = {
  title: "success" | "error" | "warning";
  desc: string;
  id: string;
};

type ModalName = "confirm" | "edit" | "setting";

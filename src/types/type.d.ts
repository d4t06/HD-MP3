type Location = "admin-songs" | "my-song" | "my-playlist" | "sys-playlist";

type User = {
  display_name: string;
  email: string;
  photo_url: string;
  playlist_ids: string[];
  liked_song_ids: string[];
  recent_song_ids: string[];
  recent_playlist_ids: string[];
  role: string;
};

type Song = {
  id: string;
  name: string;
  singer: string;
  image_url: string;
  image_file_path: string;
  song_url: string;
  song_file_path: string;
  owner_email: string;
  duration: number;
  is_has_lyric: boolean;
  blurhash_encode: string;
  size: number;
  song_in: SongIn;
  queue_id: string;
  updated_at: Timestamp;
  created_at: Timestamp;
};

type SongSchema = Omit<Song, "id">;

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
  song_ids: string[];
  owner_email: string;
  is_public: boolean;
  updated_at: Timestamp;
  created_at: Timestamp;
};

type PlaylistSchema = Omit<Playlist, "id">;

type SongLyric = {
  id: string;
  base: string;
  real_time: RealTimeLyric[];
};

type RawSongLyric = Omit<SongLyric, "real_time"> & {
  real_time: string;
};

type LyricTune = {
  grow: string;
  end: number;
  start: number;
};

interface RealTimeLyric {
  start: number;
  end: number;
  text: string;
  tune?: LyricTune;
}

type ThemeKeyType =
  | "red"
  | "green_light"
  | "deep_blue"
  | "gray"
  | "white"
  | "black"
  | "tet";

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
  modal_bg: string;
  image?: string;
};

type Toast = {
  variant: "success" | "error";
  desc: string;
  id: string;
};

type ModalName = "confirm" | "edit" | "setting";

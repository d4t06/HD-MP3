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
  image_url: string;
  image_file_path: string;
  song_url: string;
  song_file_path: string;
  owner_email: string;
  distributor: string;
  is_official: boolean;
  duration: number;
  is_has_lyric: boolean;
  blurhash_encode: string;
  singers: Singer[];
  singer_map: Record<string, boolean>;
  genres: Genre[];
  genre_map: Record<string, boolean>;
  size: number;
  queue_id: string;
  updated_at: Timestamp;
  created_at: Timestamp;
};

type SongSchema = Omit<Song, "id" | "queue_id">;

type ParserSong = {
  name: string;
  singer: string;
  lyric: string;
};

type Playlist = {
  id: string;
  name: string;
  image_url: string;
  image_file_path: string;
  blurhash_encode: string;
  distributor: string;
  song_ids: string[];
  owner_email: string;
  is_official: boolean;
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

type Singer = {
  id: string;
  name: string;
  image_url: string;
  image_path: string;
  birthday: Timestamp;
  description: string;
  created_at: Timestamp;
};

type SingerSchema = Omit<Singer, "id">;

type Genre = {
  id: string;
  name: string;
};

type GenreSchema = Omit<Genre, "id">;

type Language = {
  id: string;
  name: string;
};

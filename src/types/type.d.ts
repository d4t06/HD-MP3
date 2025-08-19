type Location = "admin-songs" | "my-song" | "my-playlist" | "sys-playlist";

type User = {
  display_name: string;
  email: string;
  photo_url: string;
  liked_playlist_ids: string[];
  liked_song_ids: string[];
  liked_singer_ids: string[];
  recent_song_ids: string[];
  recent_playlist_ids: string[];
  liked_comment_ids: string[];
  role: string;
  last_seen: Timestamp;
};

type Song = {
  id: string;
  meta: string[];
  name: string;
  image_url: string;
  image_file_id: string;
  song_url: string;
  song_file_id: string;
  beat_url: string;
  beat_file_id: string;
  owner_email: string;
  distributor: string;
  is_official: boolean;
  duration: number;
  like: number;
  comment: number;
  total_play: number;
  lyric_id: string;
  blurhash_encode: string;
  singers: Singer[];
  singer_map: Record<string, boolean>;
  main_genre?: Genre;
  genres: Genre[];
  genre_ids: string[];
  // genre_map: Record<string, boolean>;
  size: number;
  queue_id: string;
  today_play: number;
  week_play: number;
  last_week_rank: number;
  rank: number;
  release_year: number;
  updated_at: Timestamp;
  created_at: Timestamp;
  last_active: Timestamp;
};

type SongSchema = Omit<Song, "id" | "queue_id">;

type ParserSong = {
  name: string;
  singer: string;
  image: ArrayBuffer | null;
  duration: number;
};

type Playlist = {
  id: string;
  meta: string[];
  name: string;
  image_url: string;
  image_file_id: string;
  blurhash_encode: string;
  distributor: string;
  song_ids: string[];
  owner_email: string;
  singer_map: Record<string, boolean>;
  singers: Singer[];
  is_official: boolean;
  is_public: boolean;
  like: number;
  comment: number;
  is_album: boolean;
  updated_at: Timestamp;
  created_at: Timestamp;
};

type PlaylistSchema = Omit<Playlist, "id">;

type SongLyric = {
  id: string;
  base: string;
  lyrics: Lyric[];
};

interface Lyric {
  start: number;
  end: number;
  text: string;
  tune: LyricTune;
  cut: number[][];
}

type LyricTune = {
  grow: number[];
  end: number;
  start: number;
};

type RawSongLyric = Omit<SongLyric, "lyrics"> & {
  lyrics: string;
};

type SongLyricSchema = Omit<SongLyric, "lyrics" | "id"> & {
  lyrics: string;
};

type ThemeKeyType =
  | "red"
  | "light_green"
  | "deep_blue"
  | "brown"
  | "white"
  | "black"
  | "tet"
  | "dashboard";

type ThemeType = {
  name: string;
  id: ThemeKeyType;
  type: "light" | "dark";
  container: string;
  border: string;
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
  meta: string[];
  name: string;
  image_url: string;
  image_file_id: string;
  blurhash_encode: string;
  description: string;
  like: number;
  created_at: Timestamp;
};

type SingerSchema = Omit<Singer, "id">;

type MainGenre = {
  id: string;
  name: string;
};

type Genre = {
  id: string;
  name: string;
  is_main: boolean;
};

type GenreSchema = Omit<Genre, "id">;

type UserComment = {
  id: string;
  user_email: string;
  user_name: string;
  user_image_url: string;
  text: string;
  target_id: string;
  comment_id: string;
  like: number;
  reply: number;
  replies: UserComment[];
  updated_at: Timestamp;
  created_at: Timestamp;
};

type UserCommentSchema = Omit<UserComment, "id" | "replies">;

type ImageType = {
  id?: number;
  image_url: string;
  file_id: string;
  name: string;
  size: number;
  uploaded_at: Timestamp;
};

type Category = {
  id: string;
  name: string;
  image_url: string;
  banner_image_url: string;
  image_file_id: string;
  banner_file_id: string;
  blurhash_encode: string;
  banner_blurhash_encode: string;
  playlist_ids: string;
  song_ids: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

type CategorySchema = Omit<Category, "id">;

type PageSection = {
  name: string;
  target_ids: string;
  show: boolean;
};

type PageConfig = {
  category_ids: string;
  category_sections: PageSection[];
  playlist_sections: PageSection[];
  updated_at: Timestamp;
};

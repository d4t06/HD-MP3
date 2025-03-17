import { serverTimestamp } from "firebase/firestore";

export const initSongObject = (
  data: Partial<SongSchema> & { owner_email: string; distributor: string },
) => {
  const song: SongSchema = {
    name: "",
    image_url: "",
    song_url: "",
    beat_url: "",
    beat_file_path: "",
    duration: 0,
    play_count: 0,
    is_has_lyric: "",
    image_file_path: "",
    song_file_path: "",
    blurhash_encode: "",
    singer_map: {},
    genre_map: {},
    singers: [],
    genres: [],

    is_official: false,
    size: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    ...data,
  };

  return song;
};

export const initPlaylistObject = (
  data: Partial<PlaylistSchema> & { owner_email: string; distributor: string },
) => {
  const playlist: PlaylistSchema = {
    name: "",
    song_ids: [],
    image_url: "",
    singers: [],
    singer_map: {},
    play_count: 0,
    blurhash_encode: "",
    is_public: true,
    is_official: false,
    image_file_path: "",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    ...data,
  };

  return playlist;
};

export const initSingerObject = (data: Partial<SingerSchema>) => {
  const singer: SingerSchema = {
    name: "",
    description: "",
    image_file_path: "",
    image_url: "",
    created_at: serverTimestamp(),
    blurhash_encode: "",
    ...data,
  };

  return singer;
};

import { serverTimestamp, Timestamp } from "firebase/firestore";

export const initSongObject = (data: Partial<SongSchema> & { owner_email: string }) => {
  const song: SongSchema = {
    name: "",
    singers: [],
    image_url: "",
    song_url: "",
    duration: 0,
    is_has_lyric: false,
    image_file_path: "",
    song_file_path: "",
    blurhash_encode: "",
    genre_ids: [],
    size: 0,
    queue_id: "",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    ...data,
  };

  return song;
};

export const initPlaylistObject = (
  data: Partial<PlaylistSchema> & { owner_email: string }
) => {
  const playlist: PlaylistSchema = {
    name: "",
    song_ids: [],
    image_url: "",
    blurhash_encode: "",
    created_at: serverTimestamp(),
    is_public: false,
    updated_at: serverTimestamp(),
    ...data,
  };

  return playlist;
};

export const initSingerObject = (data: Partial<SingerSchema>) => {
  const singer: SingerSchema = {
    name: "",
    birthday: Timestamp.fromDate(new Date(Date.now())),
    description: "",
    image_path: "",
    image_url: "",
    created_at: "",
    ...data,
  };

  return singer;
};

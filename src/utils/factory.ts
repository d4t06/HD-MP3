import { serverTimestamp } from "firebase/firestore";

export const initSongObject = (data: Partial<SongSchema> & { owner_email: string }) => {
  const song: SongSchema = {
    name: "",
    singer: "",
    image_url: "",
    song_url: "",
    duration: 0,
    lyric_id: "",
    image_file_path: "",
    song_file_path: "",
    song_in: "",
    blurhash_encode: "",
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

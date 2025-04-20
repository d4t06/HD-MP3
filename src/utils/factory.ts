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
    like: 0,
    lyric_id: "",
    image_file_path: "",
    song_file_path: "",
    blurhash_encode: "",
    singer_map: {},
    genre_map: {},
    genres: [],
    singers: [],

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
    genre_map: {},
    genres: [],
    is_album: false,
    like: 0,
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

export const initAlbumObject = ({
  owner_email,
  distributor,
  ...data
}: Partial<PlaylistSchema> & {
  owner_email: string;
  distributor: string;
}) => {
  return initPlaylistObject({
    owner_email,
    is_album: true,
    is_official: true,
    is_public: true,
    distributor,
    ...data,
  });
};

export const initSingerObject = (data: Partial<SingerSchema>) => {
  const singer: SingerSchema = {
    name: "",
    description: "",
    image_file_path: "",
    image_url: "",
    like: 0,
    created_at: serverTimestamp(),
    blurhash_encode: "",
    ...data,
  };

  return singer;
};

export const initLyricObject = ({
  start,
  end,
  text,
}: {
  start: number;
  end: number;
  text: string;
}) => {
  const words = text.trim().split(" ");
  const cut = words.map(() => []);
  const grow = words.map(() => 0);

  const lyric: Lyric = {
    start, // started time of 2 last lyric
    end,
    tune: { start: start, end, grow },
    cut,
    text,
  };

  return lyric;
};

export const initCommentObject = ({
  user,
  target_id,
  ...data
}: Partial<UserCommentSchema> & { user: User; target_id: string }) => {
  const singer: UserCommentSchema = {
    target_id,
    text: "",
    like: 0,
    reply: 0,
    comment_id: "",
    user_email: user.email,
    user_image_url: user.photo_url,
    user_name: user.display_name,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    ...data,
  };

  return singer;
};

import { Query, getDocs } from "firebase/firestore";
import { nanoid } from "nanoid";
import { uploadFile } from "./firebaseService";
import { getBlurHashEncode, optimizeImage } from "./imageService";

export async function implementSongQuery(
  query: Query,
  opts?: { getQueueId: (s: Song) => string },
) {
  if (import.meta.env.DEV) console.log("Get songs");

  const songsSnap = await getDocs(query);

  if (songsSnap.docs) {
    const result = songsSnap.docs.map((doc) => {
      const song: Song = {
        ...(doc.data() as SongSchema),
        id: doc.id,
        queue_id: nanoid(4),
      };

      if (opts?.getQueueId) {
        song.queue_id = opts.getQueueId(song);
      }
      return song;
    });

    return result;
  } else return [];
}

export async function implementPlaylistQuery(query: Query) {
  const playlistsSnap = await getDocs(query);

  if (playlistsSnap.docs.length) {
    const result = playlistsSnap.docs.map((doc) => {
      const playlist: Playlist = {
        ...(doc.data() as PlaylistSchema),
        id: doc.id,
      };
      return playlist;
    });

    return result;
  } else return [];
}

export async function implementSingerQuery(query: Query) {
  const singerSnaps = await getDocs(query);

  if (singerSnaps.docs.length) {
    const result = singerSnaps.docs.map((doc) => {
      const singer: Singer = { ...(doc.data() as SingerSchema), id: doc.id };
      return singer;
    });

    return result;
  } else return [];
}

export async function implementUserQuery(query: Query) {
  const userSnaps = await getDocs(query);

  if (userSnaps.docs.length) {
    const result = userSnaps.docs.map((doc) => {
      const user: User = doc.data() as User;
      return user;
    });

    return result;
  } else return [];
}

export const optimizeAndGetHashImage = async ({
  imageFile,
  blob,
}: {
  imageFile?: File;
  blob?: Blob;
}) => {
  let IMAGE_BLOB = blob;

  if (imageFile) {
    IMAGE_BLOB = await optimizeImage(imageFile);
  }

  if (!IMAGE_BLOB) throw new Error("File not found");

  const myFile = new File([IMAGE_BLOB], "image.jpeg", {
    type: IMAGE_BLOB.type,
  });

  const uploadProcess = uploadFile({
    file: myFile,
    folder: "/images/",
  });

  const { encode } = await getBlurHashEncode(IMAGE_BLOB);
  const { fileId, url } = await uploadProcess;

  return {
    image_file_id: fileId,
    image_url: url,
    blurhash_encode: encode,
  };
};

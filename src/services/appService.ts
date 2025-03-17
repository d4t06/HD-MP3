import { Query, getDocs } from "firebase/firestore";
import { nanoid } from "nanoid";
import { uploadBlob } from "./firebaseService";
import { getBlurHashEncode, optimizeImage } from "./imageService";

export async function implementSongQuery(
  query: Query,
  opts?: { getQueueId: (s: Song) => string },
) {
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
      const playlist: Playlist = { ...(doc.data() as PlaylistSchema), id: doc.id };
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

  const uploadProcess = uploadBlob({
    blob: IMAGE_BLOB,
    folder: "/images/",
  });

  const { encode } = await getBlurHashEncode(IMAGE_BLOB);
  const { filePath, fileURL } = await uploadProcess;

  return {
    image_file_path: filePath,
    image_url: fileURL,
    blurhash_encode: encode,
  };
};

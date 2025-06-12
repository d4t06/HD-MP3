import { useState } from "react";
import { myGetDoc } from "@/services/firebaseService";

type Props = {
  setLoadingFromParent?: (v: boolean) => void;
  loadingFromParent?: boolean;
};

export default function useGetSongLyric({
  loadingFromParent,
  setLoadingFromParent,
}: Props) {
  const [loading, setLoading] = useState(false);

  const _loading = loadingFromParent || loading;
  const _setLoading = setLoadingFromParent || setLoading;

  const getLyric = async (song: Song) => {
    try {
      _setLoading(true);

      const lyricSnap = await myGetDoc({
        collectionName: "Lyrics",
        id: song.lyric_id,
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as SongLyricSchema;
        return lyricData;
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
    }
  };

  return { getLyric, _loading };
}

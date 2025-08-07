import { useState } from "react";
import { myGetDoc } from "@/services/firebaseService";

type Props = {
  setLoadingFromParent?: (v: boolean) => void;
};

export default function useGetSongLyric({
  setLoadingFromParent,
}: Props) {
  const [loading, setLoading] = useState(false);

  const _setLoading = setLoadingFromParent || setLoading;

  const getLyric = async (song: Song) => {
    try {
      if (!song.id) return;
      _setLoading(true);

      const lyricSnap = await myGetDoc({
        collectionName: "Lyrics",
        id: song.lyric_id,
        msg: "useGetLyric, get lyric"
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as SongLyricSchema;
        return lyricData;
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      _setLoading(false);
    }
  };

  return { getLyric, loading };
}

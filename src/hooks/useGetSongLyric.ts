import { useEffect, useState } from "react";
import { Lyric, Song } from "../types";
import { myGetDoc } from "../utils/firebaseHelpers";

export default function useSongLyric({ songInStore }: { songInStore: Song }) {
   const [songLyric, setSongLyric] = useState<Lyric>({
      base: "",
      real_time: [],
   });

   useEffect(() => {
      if (!songInStore.lyric_id) return;

      const getLyric = async () => {
         const lyricsData = (
            await myGetDoc({ collection: "lyrics", id: songInStore.lyric_id })
         ).data() as Lyric;

         if (lyricsData) {
            setSongLyric(lyricsData);
         }
      };
      getLyric();

      return () => setSongLyric({ base: "", real_time: [] });
   }, [songInStore]);

   return songLyric;
}

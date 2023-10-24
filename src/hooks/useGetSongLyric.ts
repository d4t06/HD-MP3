import { useEffect, useState } from "react";
import { Lyric, Song } from "../types";
import { myGetDoc } from "../utils/firebaseHelpers";

export default function useSongLyric({
   songInStore,
   audioEle,
}: {
   songInStore: Song;
   audioEle: HTMLAudioElement;
}) {
   const [songLyric, setSongLyric] = useState<Lyric>({
      base: "",
      real_time: [],
   });

   const getLyric = async () => {
      const lyricsData = (
         await myGetDoc({ collection: "lyrics", id: songInStore.lyric_id })
      ).data() as Lyric;

      if (lyricsData) {
         setSongLyric(lyricsData);
      }
   };

   useEffect(() => {
      if (!songInStore.lyric_id) return;
      if (audioEle) audioEle.addEventListener("loadeddata", getLyric);

      return () => {
         console.log("use get lyric clean up");

         if (audioEle) audioEle.removeEventListener("loadeddata", getLyric);
         setSongLyric({ base: "", real_time: [] });
      };
   }, [songInStore]);

   return songLyric;
}

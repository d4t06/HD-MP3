import { useEffect, useRef, useState } from "react";
import { Lyric, Song } from "../types";
import { myGetDoc } from "../utils/firebaseHelpers";
import { sleep } from "../utils/appHelpers";

export default function useSongLyric({
   songInStore,
   audioEle,
   isOpenFullScreen,
}: {
   songInStore: Song;
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
}) {
   const [songLyric, setSongLyric] = useState<Lyric>({
      base: "",
      real_time: [],
   });

   const [loading, setLoading] = useState(false);
   const [isSongLoaded, setIsSongLoaded] = useState(false);
   // const isSongLoaded = useRef(false)

   const handleSongLoaded = async () => {
      await sleep(1000);
      console.log("song loaded");

      setIsSongLoaded(true);
   };

   const getLyric = async () => {
      console.log(">>> api: run get lyric");

      setLoading(true);
      await sleep(1000);
      setSongLyric({ base: "kdafs", real_time: [{ end: 100, start: 0, text: "Test" }] });
      setLoading(false);

      // try {
      //    const lyricsData = (
      //       await myGetDoc({
      //          collection: "lyrics",
      //          id: songInStore.lyric_id,
      //          msg: ">>> api: get lyric doc",
      //       })
      //    ).data() as Lyric;

      //    if (lyricsData) {
      //       setSongLyric(lyricsData);
      //    }
      // } catch (error) {
      //    console.log("[error] get lyric error");
      // } finally {
      // }
   };

   useEffect(() => {
      if (audioEle) audioEle.addEventListener("loadeddata", handleSongLoaded);

      return () => {
         console.log(">>> local: lyric clean up");
         if (audioEle) audioEle.removeEventListener("loadeddata", handleSongLoaded);
      };
   }, []);

   useEffect(() => {
      // if (!isSongLoaded) return;
      // if (!songInStore.lyric_id) return;

      // getLyric();

      return () => {
         setIsSongLoaded(false);
         setLoading(true)
         setSongLyric({ base: "", real_time: [] });
      };
   }, [songInStore]);

   useEffect(() => {
      if (!songInStore.lyric_id) {
         setLoading(false)
         return;
      }
      if (songLyric.real_time.length) return;
      if (isSongLoaded && isOpenFullScreen) {
         getLyric();
      }
   }, [isSongLoaded, isOpenFullScreen]);

   return { songLyric, loading };
}

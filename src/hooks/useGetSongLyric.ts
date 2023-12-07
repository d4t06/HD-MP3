import { useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import { myGetDoc } from "../utils/firebaseHelpers";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { selectAllSongStore } from "../store";

export default function useSongLyric({
   audioEle,
   isOpenFullScreen,
}: {
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
}) {
   const { song: songInStore } = useSelector(selectAllSongStore);
   const {
      playStatus: { isError },
   } = useSelector(selectAllPlayStatusStore);

   const [songLyric, setSongLyric] = useState<Lyric>({
      id: "",
      base: "",
      real_time: [],
   });

   const [loading, setLoading] = useState(false);
   const [isSongLoaded, setIsSongLoaded] = useState(false);
   const timerId = useRef<NodeJS.Timeout>();

   const getLyric = async () => {
      setLoading(true);

      try {
         const lyricSnap = await myGetDoc({
            collection: "lyrics",
            id: songInStore.lyric_id,
            msg: ">>> api: get lyric doc",
         });

         if (lyricSnap.exists()) {
            const lyricData = lyricSnap.data() as Lyric;
            setSongLyric(lyricData);
         }
      } catch (error) {
         console.log("[error] get lyric error");
      } finally {
         setLoading(false);
      }
   };

   const resetForNewSong = () => {
      clearTimeout(timerId.current);
      setIsSongLoaded(false);
      setLoading(true);
      setSongLyric({ base: "", real_time: [], id: "" });
   };

   //  add event
   useEffect(() => {
      const handleSongLoaded = async () => {
         console.log("song loaded");
         setIsSongLoaded(true);
      };

      if (audioEle) audioEle.addEventListener("loadeddata", handleSongLoaded);

      return () => {
         if (audioEle) audioEle.removeEventListener("loadeddata", handleSongLoaded);
      };
   }, []);

   //  api get lyric
   useEffect(() => {
      if (!songInStore.lyric_id && isSongLoaded) {
         setLoading(false);
         return;
      }
      if (songLyric.real_time.length) return;
      if (isSongLoaded && isOpenFullScreen) {
         timerId.current = setTimeout(() => {
            getLyric();
         }, 500);
      }
   }, [isSongLoaded, isOpenFullScreen]);

   //  reset
   useEffect(() => {
      if (isError) {
         setLoading(false);
         return;
      }
      return () => resetForNewSong();
   }, [songInStore, isError]);

   return { songLyric, loading };
}

import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import LyricEditor from "../components/LyricEditor";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../store/ThemeContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Lyric } from "../types";

export default function Edit() {
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { theme } = useTheme();

   const [lyricsData, setLyricsData] = useState<{
      base: string;
      realtime: Lyric[];
   }>({ base: "", realtime: [] });
   const [lyricResult, setLyricResult] = useState<Lyric[]>([]);
   const audioRef = useRef<HTMLAudioElement>(null);

   const navigate = useNavigate();

   const handleUpdateLyric = async () => {
      try {
         console.log("lyric result", lyricResult);
         
         await setDoc(doc(db, "lyrics", songInStore.lyric_id as string), {lyric : lyricResult}, {
            merge: true,
         });

         alert("added to db")
      } catch (error) {
         console.log({ message: error });
      }
   };

   useEffect(() => {
      console.log("check song in store", songInStore);

      if (!songInStore.name) navigate(routes.home);
      if (!songInStore.lyric_id) return;

      const getLyric = async () => {
         const docRef = doc(db, "lyrics", songInStore.lyric_id);
         const docSnap = await getDoc(docRef);

         const lyricsData = docSnap.data() as {
            base: string;
            realtime: Lyric[];
         };

         if (lyricsData) {
            console.log("check lyric data", lyricsData);

            setLyricsData(lyricsData);
         }
      };
      getLyric();
      if (audioRef.current) {
      }
   }, []);

   if (!songInStore.name) return;

   return (
      <div className="pt-[30px]">
         <audio ref={audioRef} src={songInStore.song_path} className="hidden" />
         {audioRef.current && (
            <LyricEditor
               setLyricResult={setLyricResult}
               lyricResult={lyricResult}
               lyricsData={lyricsData}
               audioEle={audioRef.current}
               theme={theme}
            />
         )}

         <button onClick={() => handleUpdateLyric()} >save</button>
      </div>
   );
}

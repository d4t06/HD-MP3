import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "../routes";

import LyricEditor from "../components/LyricEditor";
import { myGetDoc } from "../utils/firebaseHelpers";
import { useSongsStore, useTheme } from "../store";
import { useInitSong } from "../hooks";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { selectCurrentSong } from "@/store/currentSongSlice";

export default function Edit() {
   const { theme } = useTheme();
   const { currentSong } = useSelector(selectCurrentSong);

     
     

   const { userSongs } = useSongsStore();

   //  state
   const [targetSong, setTargetSong] = useState<Song>();
   const [lyric, setLyric] = useState<Lyric>({
      base: "",
      real_time: [],
      id: "",
   });
   const audioRef = useRef<HTMLAudioElement>(null);
   const [loading, setLoading] = useState(false);
   const firstTimeRun = useRef<boolean>(true);

   //  use hooks
   const { errorMsg, loading: useSongsLoading, initial } = useInitSong({});
   const navigate = useNavigate();
   const params = useParams<{ id: string }>();

   const getLyric = useCallback(async (song: Song) => {
      try {
         if (song.lyric_id) {
            setLoading(true);
            const lyricSnapshot = await myGetDoc({
               collection: "lyrics",
               id: song.lyric_id,
               msg: ">>> api: get lyric doc",
            });

            if (lyricSnapshot.exists()) {
               const lyricData = lyricSnapshot.data() as Lyric;
               setLyric(lyricData);
            }
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         setLoading(false);
      }
   }, []);

   const getSong = useCallback(async () => {
      console.log("get song");
      if (currentSong.name && currentSong.id === params.id) {
         currentSong.by === "admin"
            ? navigate(routes.Home)
            : [setTargetSong(currentSong), await getLyric(currentSong)];
      } else {
         const song = userSongs.find((song) => song.id === params.id);
         if (song) {
            setTargetSong(song);
            await getLyric(song);
         } else navigate(routes.Home);
      }
   }, [currentSong, userSongs]);

   useEffect(() => {
      if (!initial) return;

      if (firstTimeRun.current) {
         if (!targetSong) getSong();
         firstTimeRun.current = false;
      }
   }, [initial]);

   if (useSongsLoading || loading)
      return (
         <h1>
            <ArrowPathIcon className="w-[25px] animate-spin" />
         </h1>
      );
   if (errorMsg) return <h1>{errorMsg}</h1>;

   // console.log('edit check lyric', lyric);

   return (
      <div className="">
         {/* audio element always visible */}
         <audio ref={audioRef} src={targetSong?.song_url} className="hidden" />
         {targetSong && (
            <>
               {/* <Link
                  to={routes.MySongs}
                  className={`inline-flex text-[20px] font-bold mb-[14px] ${theme.content_hover_text}`}
               >
                  <ChevronLeftIcon className="w-[25px]" />
                  <span className="ml-[12px]">{targetSong.name}</span>
               </Link> */}
               <LyricEditor
                  lyric={lyric}
                  audioRef={audioRef}
                  theme={theme}
                  song={targetSong}
               />
            </>
         )}
      </div>
   );
}

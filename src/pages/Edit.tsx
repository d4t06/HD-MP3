import { Lyric, Song } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "../routes";

import LyricEditor from "../components/LyricEditor";
import { myGetDoc } from "../utils/firebaseHelpers";
import { selectAllSongStore, useSongsStore, useTheme } from "../store";
import { useSongs } from "../hooks";

export default function Edit() {
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { userSongs, initial } = useSongsStore();

   //  state
   const [targetSong, setTargetSong] = useState<Song>();
   const [lyric, setLyric] = useState<Lyric>({ base: "", real_time: [] });
   const audioRef = useRef<HTMLAudioElement>(null);
   const [loading, setLoading] = useState(false);

   //  use hooks
   const { errorMsg, loading: useSongsLoading } = useSongs();
   const navigate = useNavigate();
   const params = useParams<{ id: string }>();

   useEffect(() => {
      console.log('useEffect 1', targetSong?.name);
      
      if (!userSongs.length || !initial) return;

      const getSong = () => {
         console.log("get song");
         setLoading(true)

         if (songInStore.name && songInStore.id === params.id) {

            if (songInStore.by === "admin") navigate(routes.Home);
            else setTargetSong(songInStore);

         } else {

            const song = userSongs.find((song) => song.id === params.id);
            if (song) {
               setTargetSong(song);
            } else navigate(routes.Home);
         }
      };

      if (!targetSong) getSong();
   }, []);

   useEffect(() => {
      console.log("useEffect 2");
      const getLyric = async () => {
         if (!targetSong) return;
         try {
            if (targetSong.lyric_id) {
               const lyricSnapshot = await myGetDoc({
                  collection: "lyrics",
                  id: targetSong.lyric_id,
               });
               const lyricData = lyricSnapshot.data() as Lyric;

               setLyric(lyricData);

               await new Promise<void>((rs) => {
                  setTimeout(() => {
                     setLoading(false);

                     rs();
                  }, 2000);
               });
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      getLyric();
   }, [targetSong]);

   console.log("edit page render");

   if (useSongsLoading || loading) return <h1>...</h1>;
   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <div className="pb-[30px]">
         {/* audio element always visible */}
         <audio ref={audioRef} src={targetSong?.song_url} className="hidden" />

         {targetSong  && (
            <LyricEditor lyric={lyric} audioRef={audioRef} theme={theme} song={targetSong} />
         )}
      </div>
   );
}

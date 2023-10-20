import { Lyric, Song } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useTheme, useAuthStore } from "../store";

import LyricEditor from "../components/LyricEditor";
import { routes } from "../routes";
import { myGetDoc } from "../utils/firebaseHelpers";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Edit() {
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();

   const [song, setSong] = useState<Song>();
   const [lyric, setLyric] = useState<Lyric>({ base: "", real_time: [] });

   const audioRef = useRef<HTMLAudioElement>(null);
   const params = useParams<{ id: string }>();
   const navigate = useNavigate();

   useEffect(() => {
      if (userInfo.status === "loading") return;

      if (!userInfo.email) {
         navigate(routes.Home);
         return;
      }

      const getSong = async () => {
         try {
            const songSnapshot = await myGetDoc({ collection: "songs", id: params?.id as string });

            const songData = songSnapshot.data() as Song;

            // if song already had lyric, get it and pass to children component
            if (songData.lyric_id) {
               const lyricSnapshot = await myGetDoc({
                  collection: "lyrics",
                  id: songData.lyric_id,
               });
               const lyricData = lyricSnapshot.data() as Lyric;

               setLyric(lyricData);
            }

            setSong({ ...songData, id: songSnapshot.id });
         } catch (error) {
            console.log({ message: error });
         }
      };

      getSong();
   }, []);

   return (
      <div className={`container mx-auto pt-[30px]`}>
         <audio ref={audioRef} src={song && song.song_url} className="hidden" />
         {/* audio element always visible */}
         {song && (
            <>
               <Link
                  to={routes.Dashboard}
                  className={`inline-flex text-[20px] font-bold mb-[14px] ${theme.content_hover_text}`}
               >
                  <ChevronLeftIcon className="w-[25px]" />
                  <span className="ml-[12px]">{song.name}</span>
               </Link>

               <LyricEditor lyric={lyric} audioRef={audioRef} theme={theme} song={song} />
            </>
         )}
      </div>
   );
}

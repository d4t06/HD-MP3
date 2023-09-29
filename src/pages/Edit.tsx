import { Lyric, Song } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../store/ThemeContext";
import { db } from "../config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

// import { songItem } from "../store/songsList";
import LyricEditor from "../components/LyricEditor";
import { routes } from "../routes";

export default function Edit() {
  const { theme } = useTheme();
  const [song, setSong] = useState<Song>();
  const [lyric, setLyric] = useState<Lyric>({ base: "", real_time: [] });

  const audioRef = useRef<HTMLAudioElement>(null);
  const params = useParams();
  const navigate =useNavigate()

  useEffect(() => {
    const getSong = async () => {
      try {
        const songDocRef = doc(collection(db, "songs"), params?.id);
        const songSnapshot = await getDoc(songDocRef);

        const songData = songSnapshot.data() as Song;

        // if song upload by admin
        if (songData.by === 'admin') navigate(routes.Home)

        // if song already had lyric, get it and pass to children component
        if (songData.lyric_id) {
          const lyricSnapshot = await getDoc(doc(db, "lyrics", songData.lyric_id));
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

  // console.log("Check song", song);

  return (
    <div className="pt-[30px]">
      <audio ref={audioRef} src={song && song.song_url} className="hidden" />

      {/* audio element always visible */}
      {audioRef.current && song && (
        <LyricEditor
          lyric={lyric}
          audioEle={audioRef.current}
          theme={theme}
          song={song}
        />
      )}
    </div>
  );
}

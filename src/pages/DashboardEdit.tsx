import { Lyric, Song } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useTheme, useAuthStore } from "../store";

import LyricEditor from "../components/LyricEditor";
import { routes } from "../routes";
import { myGetDoc } from "../utils/firebaseHelpers";

export default function Edit() {
  const { theme } = useTheme();
  const { userInfo } = useAuthStore();

  const [song, setSong] = useState<Song>();
  const [lyric, setLyric] = useState<Lyric>({
    base: "",
    real_time: [],
    id: "",
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const ranUseEffect = useRef(false);
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getSong = async () => {
    try {
      const songSnapshot = await myGetDoc({
        collection: "songs",
        id: params?.id as string,
        msg: ">>> api: get song doc",
      });

      if (!songSnapshot.exists()) {
        navigate("/dashboard");
        return;
      }

      const songData = songSnapshot.data() as Song;

      // if song already had lyric, get it and pass to children component
      if (songData.lyric_id) {
        const lyricSnapshot = await myGetDoc({
          collection: "lyrics",
          id: songData.lyric_id,
        });

        if (lyricSnapshot.exists()) {
          const lyricData = lyricSnapshot.data() as Lyric;
          setLyric(lyricData);
        }
      }

      setSong(songData);
    } catch (error) {
      console.log({ message: error });
    }
  };

  useEffect(() => {
    if (userInfo.status === "loading") return;

    if (!userInfo.email) {
      navigate(routes.Home);
      return;
    }

    if (!ranUseEffect.current) {
      ranUseEffect.current = true;
      getSong();
    }
  }, []);

  return (
    <div className={`container mx-auto pb-[60px]`}>
      <audio ref={audioRef} src={song && song.song_url} className="hidden" />
      {/* audio element always visible */}
      {song && (
        <>
          <LyricEditor
            admin
            lyric={lyric}
            audioRef={audioRef}
            theme={theme}
            song={song}
          />
        </>
      )}
    </div>
  );
}

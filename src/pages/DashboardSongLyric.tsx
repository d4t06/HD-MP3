import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme, useAuthStore } from "../store";
import LyricEditor from "../components/LyricEditor";
import { routes } from "../routes";
import { myGetDoc } from "@/services/firebaseService";
import EditLyricContextProvider from "@/store/EditSongLyricContext";
import { Center } from "@/components/ui/Center";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function DashboardSongLyric() {
  const { theme } = useTheme();
  const { user, loading: userLoading } = useAuthStore();

  const [isFetching, setIsFetching] = useState(true);
  const [hasAudioEle, setHasAudioEle] = useState(false);

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
      });

      if (!songSnapshot.exists()) return navigate("/dashboard");

      const songData = songSnapshot.data() as Song;

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
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate(routes.Home);

    if (!hasAudioEle) setHasAudioEle(true);

    if (!ranUseEffect.current) {
      ranUseEffect.current = true;
      getSong();
    }
  }, []);

  return (
    <EditLyricContextProvider>
      <audio ref={audioRef} src={song && song.song_url} className="hidden" />
      {isFetching ? (
        <Center>
          <ArrowPathIcon className="w-6 animate-spin" />
        </Center>
      ) : (
        <>
          {audioRef.current && song && (
            <LyricEditor
              admin
              lyric={lyric}
              audioEle={audioRef.current}
              theme={theme}
              song={song}
            />
          )}
        </>
      )}
    </EditLyricContextProvider>
  );
}

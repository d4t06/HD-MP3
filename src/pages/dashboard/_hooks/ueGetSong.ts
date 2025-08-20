import { myGetDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useGetSong() {
  const [isFetching, setIsFetching] = useState(true);
  const [song, setSong] = useState<Song>();

  const ranEffect = useRef(false);

  const navigator = useNavigate();

  const { setErrorToast } = useToastContext();

  const getSong = async (id: string) => {
    try {
      const docRef = await myGetDoc({
        collectionName: "Songs",
        id,
        msg: "useGetSong, Get song doc",
      });
      if (!docRef.exists()) return navigator("/dashboard/song");

      const song: Song = {
        ...(docRef.data() as SongSchema),
        id: docRef.id,
        queue_id: "",
      };

      if (!song.is_official) return navigator("/dashboard/song");

      setSong(song);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { song, isFetching, getSong, ranEffect };
}

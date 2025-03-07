import { myGetDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useRef, useState } from "react";

export default function useGetSong() {
  const [isFetching, setIsFetching] = useState(true);
  const [song, setSong] = useState<Song>();

  const ranEffect = useRef(false);

  const { setErrorToast } = useToastContext();

  const getSong = async (id: string) => {
    try {
      const docRef = await myGetDoc({ collectionName: "Songs", id });

      const song: Song = {
        ...(docRef.data() as SongSchema),
        id: docRef.id,
        queue_id: "",
      };

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

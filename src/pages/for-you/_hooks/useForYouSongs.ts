import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSongsContext } from "../_stores/SongsContext";

export default function useGetForYouSongs() {
  const { setSongs } = useSongsContext();
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const getSong = async () => {
    try {
      setIsFetching(true);

      const getSongQuery = query(
        songsCollectionRef,
        where("is_official", "==", true),
        orderBy("updated_at", "desc"),
        limit(20),
      );

      const result = await implementSongQuery(getSongQuery);
      setSongs((prev) => [...prev, ...result]);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getSong();

    return () => {
      setIsFetching(true);
    };
  }, []);

  return { isFetching, getSong };
}

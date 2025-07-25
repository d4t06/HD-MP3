import { useEffect, useRef, useState } from "react";
import { collection, documentId, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { implementSongQuery } from "@/services/appService";

type Props = {
  setSongs: (s: Song[]) => void;
  songIds: string[];
};

export default function useGetSongs({ setSongs, songIds }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const ranEffect = useRef(false);

  const getSongs = async () => {
    try {
      if (!songIds.length) return;

      setIsFetching(true);

      const q = query(
        collection(db, "Songs"),
        where(documentId(), "in", songIds),
      );

      const result = await implementSongQuery(q);

      setSongs(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getSongs();
    }
  }, []);

  return { isFetching };
}

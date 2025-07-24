import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { nanoid } from "nanoid";
import { implementSongQuery } from "@/services/appService";

type Props = {
  setSongs: (s: Song[]) => void;
  songIds: string[];
};

export default function useGetSongs({ setSongs, songIds }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const ranEffect = useRef(false);

  const { id } = useParams<{ id: string }>();

  const getSongs = async () => {
    try {
      if (!id) return;
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

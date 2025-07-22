import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSongsContext } from "../_stores/SongsContext";
import { nanoid } from "nanoid";

export default function useGetForYouSongs() {
  const { setSongs } = useSongsContext();
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);
  // const [currentIndex, setCurrentIndex] = useState(0);

  const ranEffect = useRef(false);
  const lastVisible = useRef<QueryDocumentSnapshot>();

  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((el: HTMLDivElement) => {
    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // const index = entries[0].target.getAttribute("data-index") || "0";
          // setCurrentIndex(+index);
          getSong();
        }
      },
      { threshold: 1 },
    );
    if (el) intObserver.current.observe(el);
  }, []);

  const getSong = async () => {
    try {
      setIsFetching(true);

      const getSongQuery = !!lastVisible.current
        ? query(
            songsCollectionRef,
            where("is_official", "==", true),
            orderBy("updated_at", "desc"),
            startAfter(lastVisible.current),
            limit(3),
          )
        : query(
            songsCollectionRef,
            where("is_official", "==", true),
            orderBy("updated_at", "desc"),
            limit(3),
          );

      if (import.meta.env.DEV) console.log("useGetForYouSongs, get song docs");

      const songsSnap = await getDocs(getSongQuery);

      if (songsSnap.docs) {
        lastVisible.current = songsSnap.docs[songsSnap.docs.length - 1];

        const result = songsSnap.docs.map((doc) => {
          const song: Song = {
            ...(doc.data() as SongSchema),
            id: doc.id,
            queue_id: nanoid(4),
          };

          return song;
        });

        setSongs((prev) => [...prev, ...result]);
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  // useEffect(() => {
  //   if (!ranEffect.current) return;

  //   getSong();
  // }, [currentIndex]);

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getSong();
    }
  }, []);

  return { isFetching, getSong, lastElementRef };
}

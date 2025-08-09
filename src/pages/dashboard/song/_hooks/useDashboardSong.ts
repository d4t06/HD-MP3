import { FormEvent, useEffect, useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { implementSongQuery } from "@/services/appService";
import { getSearchQuery, songsCollectionRef } from "@/services/firebaseService";

const pageSize = 6;

const tabs = ["All", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useDashboardSong() {
  const {
    setUploadedSongs,
    lastDoc,
    shouldFetchUserSongs,
    setHasMore,
    // setPage,
  } = useSongContext();
  const { setErrorToast } = useToastContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");

  const [searchResult, setSearchResult] = useState<Song[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (isFetching) return;

      setIsFetching(true);

      const q = getSearchQuery(
        songsCollectionRef,
        [where("is_official", "==", true)],
        value,
      );

      const result = await implementSongQuery(q);

      setSearchResult(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const getSong = async () => {
    try {
      setIsFetching(true);

      const songsCollectionRef = collection(db, "Songs");

      const searchQuery = lastDoc.current
        ? query(
            songsCollectionRef,
            where("is_official", "==", true),
            orderBy("updated_at", "desc"),
            startAfter(lastDoc.current),
            limit(pageSize),
          )
        : query(
            songsCollectionRef,
            where("is_official", "==", true),
            orderBy("updated_at", "desc"),
            limit(pageSize),
          );

      if (import.meta.env.DEV) console.log("Get songs");

      const songsSnap = await getDocs(searchQuery);

      const result = songsSnap.docs.map((doc) => {
        const song: Song = {
          ...(doc.data() as SongSchema),
          id: doc.id,
          queue_id: "",
        };

        return song;
      });

      if (lastDoc.current) setUploadedSongs((prev) => [...prev, ...result]);
      else setUploadedSongs(result);

      if (result.length < pageSize) setHasMore(false);
      else {
        lastDoc.current = songsSnap.docs[pageSize - 1];
      }
      
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (shouldFetchUserSongs.current) {
      shouldFetchUserSongs.current = false;

      getSong();
    } else {
      setIsFetching(false);
    }
  }, []);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    tab,
    setTab,
    tabs,
    getSong,
    searchResult,
  };
}

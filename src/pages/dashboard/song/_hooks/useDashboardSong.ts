import { FormEvent, useEffect, useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { collection, getDocs, orderBy, Query, query, where } from "firebase/firestore";
import { db } from "@/firebase";

type DashboardSongTab = "All" | "Result";

async function implementQuery(query: Query) {
  const songsSnap = await getDocs(query);

  if (songsSnap.docs) {
    const result = songsSnap.docs.map((doc) => {
      const song: Song = { ...(doc.data() as SongSchema), id: doc.id, queue_id: "" };
      return song;
    });

    return result;
  } else return [];
}

export default function useDashboardSong() {
  const { songs, setSongs } = useSongContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<DashboardSongTab>("All");

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const songsCollectionRef = collection(db, "Songs");

      const searchQuery = query(
        songsCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
        where("is_official", "==", true)
      );

      const result = await implementQuery(searchQuery);

      setSongs(result);
      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleGetSong = async () => {
    try {
      setIsFetching(true);

      const songsCollectionRef = collection(db, "Songs");

      const searchQuery = query(
        songsCollectionRef,
        where("is_official", "==", true),
        orderBy("updated_at", "desc")
      );

      const result = await implementQuery(searchQuery);
      setSongs(result);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tab !== "All") return;

    handleGetSong();
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    songs,
    tab,
    setTab,
  };
}

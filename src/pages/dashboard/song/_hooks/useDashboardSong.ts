import { FormEvent, useEffect, useState } from "react";
import { getSongs } from "@/services/appService";
import { useSongContext, useToast } from "@/store";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

type DashboardSongTab = "All" | "Result";

export default function useDashboardSong() {
  const { songs, setSongs } = useSongContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<DashboardSongTab>("All");

  const { setErrorToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const songsCollectionRef = collection(db, "songs");

      const searchQuery = query(
        songsCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
        where("by", "==", "admin"),
      );

      const songsSnap = await getDocs(searchQuery);

      if (songsSnap.docs) {
        const result = songsSnap.docs.map((doc) => doc.data() as Song);

        setTab("Result");
        setSongs(result);
      }
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

      const songs = await getSongs({
        variant: "dashboard",
      });
      if (songs) setSongs(songs);
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

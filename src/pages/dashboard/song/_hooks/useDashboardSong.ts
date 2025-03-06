import { FormEvent, useEffect, useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";

type DashboardSongTab = "All" | "Result";

export default function useDashboardSong() {
  const { songs, setSongs } = useSongContext();
  const { user } = useAuthContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<DashboardSongTab>("All");

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (!user) return;

      setIsFetching(true);

      const songsCollectionRef = collection(db, "Songs");

      const searchQuery = query(
        songsCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
        where("owner_email", "==", user.email)
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
      if (!user) return;
      setIsFetching(true);

      const songsCollectionRef = collection(db, "Songs");

      const searchQuery = query(
        songsCollectionRef,
        where("owner_email", "==", user.email),
        orderBy("created_at", "desc")
      );

      const songsSnap = await getDocs(searchQuery);

      if (songsSnap.docs) {
        const result = songsSnap.docs.map((doc) => doc.data() as Song);

        setSongs(result);
      }
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

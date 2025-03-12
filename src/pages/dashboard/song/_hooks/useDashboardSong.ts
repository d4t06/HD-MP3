import { FormEvent, useEffect, useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { implementSongQuery } from "@/services/appService";

type DashboardSongTab = "All" | "Result";

export default function useDashboardSong() {
  const { uploadedSongs, setUploadedSongs } = useSongContext();

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
        where("is_official", "==", true),
      );

      const result = await implementSongQuery(searchQuery);

      setUploadedSongs(result);
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
        orderBy("updated_at", "desc"),
      );

      const result = await implementSongQuery(searchQuery);
      setUploadedSongs(result);
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
    uploadedSongs,
    tab,
    setTab,
  };
}

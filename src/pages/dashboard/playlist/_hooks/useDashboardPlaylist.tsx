import { FormEvent, useEffect, useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { orderBy, query, where } from "firebase/firestore";
import { playlistCollectionRef } from "@/services/firebaseService";
import { implementPlaylistQuery } from "@/services/appService";

const tabs = ["All", "Result"] as const;

type Tab = typeof tabs[number]

export default function useDashboardPlaylist() {
  const { setPlaylists, playlists } = useSongContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const searchQuery = query(
        playlistCollectionRef,
        where("is_official", "==", true),
        where("is_album", "==", false),
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const result = await implementPlaylistQuery(searchQuery);
      setPlaylists(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleGetPlaylist = async () => {
    try {
      setIsFetching(true);

      const searchQuery = query(
        playlistCollectionRef,
        where("is_official", "==", true),
        where("is_album", "==", false),
        orderBy("updated_at", "desc"),
      );

      const result = await implementPlaylistQuery(searchQuery);
      setPlaylists(result);
    } catch (err) {
      console.log({ message: err });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tab === "All") handleGetPlaylist();
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    playlists,
    tab,
    setTab,
    tabs
  };
}

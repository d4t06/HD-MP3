import { FormEvent, useEffect, useState } from "react";
import { useToastContext } from "@/stores";
import { orderBy, query, where } from "firebase/firestore";
import { playlistCollectionRef } from "@/services/firebaseService";
import { implementPlaylistQuery } from "@/services/appService";

const tabs = ["All", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useDashboardAlbum() {
  const [albums, setAlbums] = useState<Playlist[]>([]);

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
        where("is_album", "==", true),
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff")
      );

      const result = await implementPlaylistQuery(searchQuery);
      setAlbums(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleGetAlbum = async () => {
    try {
      setIsFetching(true);

      const searchQuery = query(
        playlistCollectionRef,
        where("is_album", "==", true),
        orderBy("created_at", "desc")
      );

      const result = await implementPlaylistQuery(searchQuery);
      setAlbums(result);
    } catch (err) {
      console.log({ message: err });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tab === "All") handleGetAlbum();
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    albums,
    tab,
    setTab,
    tabs,
    setAlbums
  };
}

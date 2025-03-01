import { FormEvent, useEffect, useState } from "react";
import { getPlaylists } from "@/services/appService";
import { useSongContext, useToastContext } from "@/stores";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

type DashboardSongTab = "All" | "Result";

export default function useDashboardPlaylist() {
  const { setPlaylists, playlists } = useSongContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<DashboardSongTab>("All");

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const playlistsCollectionRef = collection(db, "playlist");

      const searchQuery = query(
        playlistsCollectionRef,
        where("by", "==", "admin"),
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const playlistsSnap = await getDocs(searchQuery);

      if (playlistsSnap.docs) {
        const result = playlistsSnap.docs.map((doc) => doc.data() as Playlist);

        setPlaylists(result);
      } else setPlaylists([]);

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

      const playlists = await getPlaylists({
        variant: "admin",
      });
      if (playlists) setPlaylists(playlists);
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
  };
}

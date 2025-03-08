import { FormEvent, useEffect, useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { Query, getDocs, orderBy, query, where } from "firebase/firestore";
import { playlistCollectionRef } from "@/services/firebaseService";

type DashboardSongTab = "All" | "Result";

async function implementQuery(query: Query) {
  const playlistsSnap = await getDocs(query);

  if (playlistsSnap.docs.length) {
    const result = playlistsSnap.docs.map((doc) => {
      const playlist: Playlist = { ...(doc.data() as PlaylistSchema), id: doc.id };
      return playlist;
    });

    return result;
  } else return [];
}

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

      const searchQuery = query(
        playlistCollectionRef,
        where("is_official", "==", true),
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const result = await implementQuery(searchQuery);
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
        orderBy("updated_at", "desc"),
      );

      const result = await implementQuery(searchQuery);
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
  };
}

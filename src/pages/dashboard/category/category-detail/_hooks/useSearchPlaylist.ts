import { db } from "@/firebase";
import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function useSearchPlaylist() {
  const { setErrorToast } = useToastContext();

  const [newPlaylists, setNewPlaylists] = useState<Playlist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [value, setValue] = useState("");
  const [lastSubmit, setLastSubmit] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  const getNewestPlaylists = async () => {
    try {
      setIsFetching(true);

      const q = query(
        collection(db, "Playlists"),
        orderBy("created_at", "desc"),
        limit(5),
      );

      const result = await implementPlaylistQuery(q);
      setNewPlaylists(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const searchQuery = query(
        playlistCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
        where("is_official", "==", true),
      );

      const result = await implementPlaylistQuery(searchQuery);

      setPlaylists(result);
      setLastSubmit(value);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getNewestPlaylists();
    }
  }, []);

  return {
    isFetching,
    value,
    playlists,
    newPlaylists,
    setValue,
    lastSubmit,
    handleSubmit,
  };
}

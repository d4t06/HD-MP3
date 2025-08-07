import { db } from "@/firebase";
import { implementPlaylistQuery } from "@/services/appService";
import {
  getSearchQuery,
  playlistCollectionRef,
} from "@/services/firebaseService";
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

      const q = query(playlistCollectionRef);

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

      const q = getSearchQuery(
        playlistCollectionRef,
        [where("is_public", "==", true)],
        value,
      );

      const result = await implementPlaylistQuery(q);

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

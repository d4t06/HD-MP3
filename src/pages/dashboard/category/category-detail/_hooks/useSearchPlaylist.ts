import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { query, where } from "firebase/firestore";
import { FormEvent, useState } from "react";

export default function useSearchPlaylist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const { setErrorToast } = useToastContext();

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
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, value, playlists, setValue, handleSubmit };
}

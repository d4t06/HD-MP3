import { useEffect, useRef, useState } from "react";
import { collection, documentId, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { implementPlaylistQuery } from "@/services/appService";

type Props = {
  setPlaylists: (s: Playlist[]) => void;
  playlistIds: string[];
};

export default function useGetPlaylists({ setPlaylists, playlistIds }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const ranEffect = useRef(false);

  const getPlaylist = async () => {
    try {
      setIsFetching(true);

      const q = query(
        collection(db, "Playlists"),
        where(documentId(), "in", playlistIds),
      );

      const result = await implementPlaylistQuery(q);
      setPlaylists(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getPlaylist();
    }
  }, []);

  return { isFetching };
}

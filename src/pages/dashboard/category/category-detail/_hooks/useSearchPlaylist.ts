import { implementPlaylistQuery } from "@/services/appService";
import {
  getSearchQuery,
  playlistCollectionRef,
} from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { usePlaylistsContext } from "@/stores/dashboard/PlaylistContext";
import { limit, orderBy, query, where } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";

const tabs = ["Newest", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useSearchPlaylist() {
  const { setErrorToast } = useToastContext();

  const {
    playlists,
    setPlaylists,
    setHasMore,
    shouldGetPlaylists,
    PAGE_SIZE,
    lastDoc,
  } = usePlaylistsContext();

  const [result, setResult] = useState<Playlist[]>([]);

  const [value, setValue] = useState("");
  const [lastSubmit, setLastSubmit] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<Tab>("Newest");

  const getNewestPlaylists = async () => {
    try {
      setIsFetching(true);

      setHasMore((prev) => {
        const isFetchedMoreAndNoMore = lastDoc.current && !prev;

        if (isFetchedMoreAndNoMore) {
          lastDoc.current = undefined;
          return !prev;
        }

        return prev;
      });

      // setHasMore(true);
      // lastDoc.current = undefined;

      const q = query(
        playlistCollectionRef,
        where("is_official", "==", true),
        where("is_album", "==", false),
        orderBy("updated_at", "desc"),
        limit(PAGE_SIZE),
      );

      const result = await implementPlaylistQuery(q);
      setPlaylists(result);
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
        [where("is_official", "==", true)],
        value,
      );

      const result = await implementPlaylistQuery(q);

      setResult(result);
      setLastSubmit(value);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (shouldGetPlaylists.current) {
      shouldGetPlaylists.current = false;
      getNewestPlaylists();
    }
  }, []);

  return {
    isFetching,
    value,
    playlists,
    result,
    setValue,
    lastSubmit,
    handleSubmit,
    getNewestPlaylists,
    tabs,
    tab,
    setTab,
  };
}

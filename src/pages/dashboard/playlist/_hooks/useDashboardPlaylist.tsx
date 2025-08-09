import { FormEvent, useEffect, useState } from "react";
import { useToastContext } from "@/stores";
import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import {
  getSearchQuery,
  playlistCollectionRef,
} from "@/services/firebaseService";
import { implementPlaylistQuery } from "@/services/appService";
import { usePlaylistsContext } from "@/stores/dashboard/PlaylistContext";


const tabs = ["All", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useDashboardPlaylist() {
  const { setPlaylists, lastDoc, PAGE_SIZE, setHasMore, shouldGetPlaylists } =
    usePlaylistsContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");
  const [searchResult, setSearchResult] = useState<Playlist[]>([]);

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (isFetching) return;

      setIsFetching(true);

      const q = getSearchQuery(
        playlistCollectionRef,
        [where("is_official", "==", true)],
        value,
      );

      const result = await implementPlaylistQuery(q);
      setSearchResult(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const getPlaylists = async () => {
    try {
      setIsFetching(true);

      const searchQuery = lastDoc.current
        ? query(
            playlistCollectionRef,
            where("is_official", "==", true),
            where("is_album", "==", false),
            orderBy("updated_at", "desc"),
            startAfter(lastDoc.current),
            limit(PAGE_SIZE),
          )
        : query(
            playlistCollectionRef,
            where("is_official", "==", true),
            where("is_album", "==", false),
            orderBy("updated_at", "desc"),
            limit(PAGE_SIZE),
          );

      if (import.meta.env.DEV) console.log("Get playlists");

      const snap = await getDocs(searchQuery);

      const result = snap.docs.map((doc) => {
        const playlist: Playlist = {
          ...(doc.data() as PlaylistSchema),
          id: doc.id,
        };

        return playlist;
      });

      if (lastDoc.current) setPlaylists((prev) => [...prev, ...result]);
      else setPlaylists(result);

      if (result.length < PAGE_SIZE) setHasMore(false);
      else {
        lastDoc.current = snap.docs[PAGE_SIZE - 1];
      }
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

      getPlaylists();
    } else {
      setIsFetching(false);
    }
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    getPlaylists,
    tab,
    searchResult,
    setTab,
    tabs,
  };
}

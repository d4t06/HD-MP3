import { FormEvent, useEffect, useState } from "react";
import { useToastContext } from "@/stores";
import { getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import {
  getSearchQuery,
  singerCollectionRef,
} from "@/services/firebaseService";
import { implementSingerQuery } from "@/services/appService";
import { useSingerContext } from "@/stores/dashboard/SingerContext";

const pageSize = 2;

const tabs = ["All", "Result"] as const;
type Tab = (typeof tabs)[number];

export default function useDashboardSinger() {
  const { setSingers, singers, setHasMore, shouldGetSingers, lastDoc } =
    useSingerContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");
  const [searchResult, setSearchResult] = useState<Singer[]>([]);

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const q = getSearchQuery(singerCollectionRef, [], value);

      const result = await implementSingerQuery(q);
      setSearchResult(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const getSingers = async () => {
    try {
      setIsFetching(true);

      const searchQuery = lastDoc.current
        ? query(
            singerCollectionRef,
            orderBy("created_at", "desc"),
            startAfter(lastDoc.current),
            limit(pageSize),
          )
        : query(
            singerCollectionRef,
            orderBy("created_at", "desc"),
            limit(pageSize),
          );

      if (import.meta.env.DEV) console.log("Get singers");

      const songsSnap = await getDocs(searchQuery);

      const result = songsSnap.docs.map((doc) => {
        const song: Singer = {
          ...(doc.data() as SingerSchema),
          id: doc.id,
        };

        return song;
      });

      if (lastDoc.current) setSingers((prev) => [...prev, ...result]);
      else setSingers(result);

      if (result.length < pageSize) setHasMore(false);
      else {
        lastDoc.current = songsSnap.docs[pageSize - 1];
      }
    } catch (err) {
      console.log({ message: err });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (shouldGetSingers.current) {
      shouldGetSingers.current = false;

      getSingers();
    } else {
      setIsFetching(false);
    }
  }, []);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    singers,
    tab,
    getSingers,
    setTab,
    searchResult,
    tabs,
  };
}

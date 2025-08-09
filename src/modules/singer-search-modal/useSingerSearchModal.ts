import { useSearchSinger } from "@/pages/dashboard/_hooks";
import { implementSingerQuery } from "@/services/appService";
import { singerCollectionRef } from "@/services/firebaseService";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const tabs = ["Newest", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useSingerSerchModal() {
  const {
    singers,
    PAGE_SIZE,
    setSingers,
    setHasMore,
    lastDoc,
    shouldGetSingers,
  } = useSingerContext();

  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<Tab>("Newest");

  const { isFetching: _isFetching, ...rest } = useSearchSinger({
    setIsFetchingParent: setIsFetching,
    afterSearched: () => {
      setTab("Result");
    },
  });

  const getNewestSingers = async () => {
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

      const q = query(
        singerCollectionRef,
        orderBy("created_at", "desc"),
        limit(PAGE_SIZE),
      );

      const result = await implementSingerQuery(q);
      setSingers(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (shouldGetSingers.current) {
      shouldGetSingers.current = false;

      getNewestSingers();
    }
  }, []);

  return { ...rest, isFetching, singers, getNewestSingers, tabs, tab, setTab };
}

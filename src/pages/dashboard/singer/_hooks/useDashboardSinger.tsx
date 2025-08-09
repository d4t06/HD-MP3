import { useEffect, useState } from "react";
import { useToastContext } from "@/stores";
import { getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { singerCollectionRef } from "@/services/firebaseService";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { useSearchSinger } from "../../_hooks";


const tabs = ["All", "Result"] as const;
type Tab = (typeof tabs)[number];

export default function useDashboardSinger() {
  const { setSingers, PAGE_SIZE, singers, setHasMore, shouldGetSingers, lastDoc } =
    useSingerContext();

  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");

  const { handleSubmit, result, value, setValue } = useSearchSinger({
    afterSearched: () => {
      setTab("Result");
    },
    setIsFetchingParent: setIsFetching,
  });

  const { setErrorToast } = useToastContext();

  const getSingers = async () => {
    try {
      setIsFetching(true);

      const searchQuery = lastDoc.current
        ? query(
            singerCollectionRef,
            orderBy("created_at", "desc"),
            startAfter(lastDoc.current),
            limit(PAGE_SIZE),
          )
        : query(
            singerCollectionRef,
            orderBy("created_at", "desc"),
            limit(PAGE_SIZE),
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

      if (result.length < PAGE_SIZE) setHasMore(false);
      else {
        lastDoc.current = songsSnap.docs[PAGE_SIZE - 1];
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
    result,
    tabs,
  };
}

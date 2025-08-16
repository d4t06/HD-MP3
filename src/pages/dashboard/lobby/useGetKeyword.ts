import { db } from "@/firebase";
import { useToastContext } from "@/stores";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetKeyword() {
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);

  const shouldFetchTrendingKeywords = useRef(true);

  const getTrendingKeyword = async () => {
    try {
      setIsFetching(true);
      const q = query(
        collection(db, "Trending_Keywords"),
        orderBy("today_count", "desc"),
        limit(5),
      );

      if (import.meta.env.DEV) console.log("useSearch, Get trendingKeywords");
      const snap = await getDocs(q);

      if (snap.empty) return;

      const keyWords = snap.docs.map((doc) => doc.id);

      setTrendingKeywords(keyWords);
    } catch (error) {
      console.log("error");

      setErrorToast("");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    console.log(shouldFetchTrendingKeywords.current);

    if (shouldFetchTrendingKeywords.current) {
      shouldFetchTrendingKeywords.current = false;
      getTrendingKeyword();
    }
  }, []);

  return { trendingKeywords, isFetching };
}

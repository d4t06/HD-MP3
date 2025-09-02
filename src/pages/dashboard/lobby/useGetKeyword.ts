import { db } from "@/firebase";
import { useToastContext } from "@/stores";
import { request } from "@/utils/appHelpers";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetKeyword() {
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const [actionFetching, setActionFetching] = useState(false);

  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);

  const shouldFetchTrendingKeywords = useRef(true);

  const refreshSearchLog = async (variant: "Reset" | "Refresh") => {
    try {
      setActionFetching(true);

      await request.get(
        "/trending-summary" +
          (variant === "Reset" ? "/search-daily" : "/search-log"),
      );

      setSuccessToast(`${variant} search logs successful`);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setActionFetching(false);
    }
  };

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
    if (shouldFetchTrendingKeywords.current) {
      shouldFetchTrendingKeywords.current = false;
      getTrendingKeyword();
    }
  }, []);

  return { trendingKeywords, isFetching, refreshSearchLog, actionFetching };
}

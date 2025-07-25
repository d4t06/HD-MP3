import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { getToDayTimestamp } from "@/utils/appHelpers";
import { limit, orderBy, query, where } from "firebase/firestore";
import { ComponentProps, useEffect, useRef, useState } from "react";
import TrendingSongs from ".";

export default function useGetTrendingSongs({
  amount,
}: ComponentProps<typeof TrendingSongs>) {
  const [songs, setSongs] = useState<Song[]>([]);
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranEffect = useRef(false);

  const getSong = async () => {
    try {
      setIsFetching(true);

      const startTimestamp = getToDayTimestamp([0, 0, 0, 0]);

      const getSongQuery = query(
        songsCollectionRef,
        where("last_active", ">=", startTimestamp),
        orderBy("today_play", "desc"),
        limit(amount),
      );

      // const trendingSnapShot = await getDocs(getTrending);

      // if (trendingSnapShot.empty) return;

      // const trendingSongIds = trendingSnapShot.docs.map(
      //   (d) => (d.data() as DailySongMetric).song_id,
      // );

      // const getSongQuery = query(
      //   songsCollectionRef,
      //   where(documentId(), "in", trendingSongIds),
      // );

      const result = await implementSongQuery(getSongQuery);

      setSongs(result);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getSong();
    }
  }, []);

  return { isFetching, songs };
}

import {
  myAddDoc,
  myUpdateDoc,
  songDailyColectionRef,
} from "@/services/firebaseService";
import { usePlayerContext } from "@/stores";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import {
  getDocs,
  increment,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function usePlayCount() {
  const { audioRef } = usePlayerContext();
  if (!audioRef.current)
    throw new Error("Use Control audioRef.current is undefined");

  const { currentSongData, currentQueueId } = useSelector(selectSongQueue);

  const prevQueueId = useRef("");

  const generateTimestamp = (times: number[]) => {
    const now = new Date();

    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...times,
    );

    return Timestamp.fromDate(date);
  };

  const handlePlaying = async () => {
    if (!currentQueueId || !currentSongData?.song) return;

    // only system songs 
    if (!currentSongData.song.is_official) return;

    if (prevQueueId.current !== currentQueueId) {
      console.log("play");

      prevQueueId.current = currentQueueId;

      // Convert to Firestore Timestamps
      const startTimestamp = generateTimestamp([0, 0, 0, 0]);
      const endTimestamp = generateTimestamp([23, 59, 59, 999]);

      // 2. Construct the query
      const q = query(
        songDailyColectionRef,
        where("song_id", "==", currentSongData.song.id),
        where("created_at", ">=", startTimestamp),
        where("created_at", "<=", endTimestamp),
      );

      const dailySnap = await getDocs(q);

      // if exist
      if (!dailySnap.empty) {
        const payload = {
          play: increment(1),
        };

        await myUpdateDoc({
          collectionName: "SongDaily",
          data: payload,
          id: dailySnap.docs[0].id,
          msg:"Increase play count"
        });
      } else {
        const data: SongFrequencySchema = {
          created_at: serverTimestamp(),
          song_id: currentSongData?.song.id,
          play: 1,
        };

        await myAddDoc({
          collectionName: "SongDaily",
          data,
          msg: "Add songdaily doc",
        });
      }
    }
  };

  useEffect(() => {
    audioRef.current?.addEventListener("playing", handlePlaying);

    return () => {
      audioRef.current?.removeEventListener("playing", handlePlaying);
    };
  }, [currentQueueId]);
}

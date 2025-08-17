import { increaseSongPlay } from "@/services/firebaseService";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import usePushRecentSong from "./usePushRecentSong";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function usePlayCount({ audioEle }: Props) {
  const { currentSongData, currentQueueId } = useSelector(selectSongQueue);

  const { pushRecentSong } = usePushRecentSong();
  const prevQueueId = useRef("");

  const handlePlaying = async () => {
    if (!currentQueueId || !currentSongData?.song) return;

    const songId = currentSongData.song.id;

    // only system songs
    if (!currentSongData.song.is_official) return;

    if (prevQueueId.current !== currentQueueId) {
      prevQueueId.current = currentQueueId;

      increaseSongPlay(songId);
      pushRecentSong(currentSongData.song);
    }
  };

  useEffect(() => {
    audioEle.addEventListener("playing", handlePlaying);

    return () => {
      audioEle.removeEventListener("playing", handlePlaying);
    };
  }, [currentQueueId]);
}

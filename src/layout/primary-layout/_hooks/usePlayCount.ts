import { increaseSongPlay } from "@/services/firebaseService";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function usePlayCount({ audioEle }: Props) {
  const { currentSongData, currentQueueId } = useSelector(selectSongQueue);

  const prevQueueId = useRef("");

  const handlePlaying = async () => {
    if (!currentQueueId || !currentSongData?.song) return;

    // only system songs
    if (!currentSongData.song.is_official) return;

    if (prevQueueId.current !== currentQueueId) {
      prevQueueId.current = currentQueueId;
      increaseSongPlay(currentSongData.song.id);
    }
  };

  useEffect(() => {
    audioEle.addEventListener("playing", handlePlaying);

    return () => {
      audioEle.removeEventListener("playing", handlePlaying);
    };
  }, [currentQueueId]);
}

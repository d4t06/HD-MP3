import { useEffect } from "react";
import { usePlayerContext } from "../_components/PlayerContext";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function uesAudioEffect({ audioEle }: Props) {
  const { setStatus, shouldPlayAfterLoaded, canPlay } = usePlayerContext();
  const { firstTimeSongLoaded, currentSong } = useSongsContext();

  const handleLoadStart = () => {
    setStatus("loading");
  };

  const handleLoaded = async () => {
    // when the page first load
    if (firstTimeSongLoaded.current) {
      firstTimeSongLoaded.current = false;
      setStatus("paused");

      return;
    }

    // when song item just active
    if (shouldPlayAfterLoaded.current) {
      shouldPlayAfterLoaded.current = false;

      await audioEle?.play();
    }
  };

  const handleError = () => {
    setStatus("error");
  };

  useEffect(() => {
    if (canPlay) {
      if (currentSong) {
        audioEle.src = currentSong.song_url;
      }
    }
  }, [canPlay]);

  // add events listener
  useEffect(() => {
    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("loadstart", handleLoadStart);
    audioEle.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("loadstart", handleLoadStart);
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);
}

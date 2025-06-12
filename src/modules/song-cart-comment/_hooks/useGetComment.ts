import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import { useEffect, useState } from "react";

export default function useSongCartComment() {
  const { currentSong, isOpenComment } = useSongsContext();

  const [comments, setComments] = useState<UserComment[]>([]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isOpenComment || !currentSong) return;

    return () => {
      if (isOpenComment) {
        setComments([]);
      }
    };
  }, [currentSong, isOpenComment]);

  return {
    comments,
    setComments,
    isFetching,
    setIsFetching,
  };
}

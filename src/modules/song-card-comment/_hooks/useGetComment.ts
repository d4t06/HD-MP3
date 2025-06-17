import { useGetComment } from "@/hooks";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import { useEffect, useState } from "react";

export default function useSongCartComment() {
  const { currentSong, isOpenComment } = useSongsContext();

  const [comments, setComments] = useState<UserComment[]>([]);

  const { fetchComment, isFetching } = useGetComment();

  const handleGetComment = async () => {
    const result = await fetchComment({
      target_id: currentSong.id,
    });
    if (result) {
      setComments(result);
    }
  };

  useEffect(() => {
    if (!isOpenComment || !currentSong) return;

    handleGetComment();

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
  };
}

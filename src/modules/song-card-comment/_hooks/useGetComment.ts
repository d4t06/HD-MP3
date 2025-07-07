import { useGetComment } from "@/hooks";
import { useCommentContext } from "@/modules/comment/components/CommentContext";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import { useEffect } from "react";

export default function useGetSongCardComment() {
  const { currentSong } = useSongsContext();

  const { setComments, isOpenComment, setIsFetching, shouldFetchComment } =
    useCommentContext();

  const { fetchComment } = useGetComment({
    setIsFetchingFromParent: setIsFetching,
  });

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

    if (shouldFetchComment.current) {
      shouldFetchComment.current = false;
      handleGetComment();
    }
  }, [currentSong, isOpenComment]);

  useEffect(() => {
    return () => {
      shouldFetchComment.current = true;
      setComments([]);
    };
  }, [currentSong]);
}

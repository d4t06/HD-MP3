import { useEffect } from "react";
import { useCommentContext } from "../components/CommemtContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import useGetComment from "./useGetComment";

export default function useGetSongComment() {
	const { shouldFetchComment, setComments, isOpenComment, setIsFetching } =
		useCommentContext();
	const { currentSongData } = useSelector(selectSongQueue);

	const { fetchComment } = useGetComment();

	const handleGetSongComment = async () => {
		try {
			if (!currentSongData?.song) return;

			const comments = await fetchComment({
				target_id: currentSongData.song.id,
			});

			if (comments) setComments(comments);
			else setComments([]);
		} catch (error) {
			console.log({ error });
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (!isOpenComment || !currentSongData?.song) return;

		if (shouldFetchComment.current) {
			shouldFetchComment.current = false;

			handleGetSongComment();
		}
	}, [isOpenComment]);

	useEffect(() => {
		return () => {
			if (!shouldFetchComment.current) shouldFetchComment.current = true;
		};
	}, [currentSongData?.song]);
}

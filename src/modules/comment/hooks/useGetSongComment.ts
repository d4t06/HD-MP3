import { useEffect } from "react";
import { useCommentContext } from "../components/CommemtContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import useGetComment from "./useGetComment";

export default function useGetSongComment() {
	const { shouldFetchComment, setComments, isOpenComment } =
		useCommentContext();
	const { currentSongData } = useSelector(selectSongQueue);

	const { fetchComment } = useGetComment();

	const handleGetSongComment = async () => {
		if (!currentSongData?.song) return;

		const comments = await fetchComment({
			target_id: currentSongData.song.id,
		});

		if (comments) setComments(comments);
		else setComments([])
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

	console.log(shouldFetchComment.current);
}

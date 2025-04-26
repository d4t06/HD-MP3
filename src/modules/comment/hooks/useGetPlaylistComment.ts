import { useEffect } from "react";
import { useCommentContext } from "../components/CommemtContext";
import { useSelector } from "react-redux";
import useGetComment from "./useGetComment";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

export default function useGetPlaylistComment() {
	const { shouldFetchComment, setComments, isOpenComment, setIsFetching } =
		useCommentContext();
	const { currentPlaylist } = useSelector(selectCurrentPlaylist);

	const { fetchComment } = useGetComment();

	const handleGetPlaylistComment = async () => {
		try {
			if (!currentPlaylist) return;

			const comments = await fetchComment({
				target_id: currentPlaylist.id,
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
		if (!isOpenComment || !currentPlaylist) return;

		if (shouldFetchComment.current) {
			shouldFetchComment.current = false;

			handleGetPlaylistComment();
		}
	}, [isOpenComment]);
}

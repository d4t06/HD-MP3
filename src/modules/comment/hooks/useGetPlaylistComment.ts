import { useEffect } from "react";
import { useCommentContext } from "../components/CommentContext";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useGetComment } from "@/hooks";

export default function useGetPlaylistComment() {
	const { shouldFetchComment, setComments, isOpenComment, setIsFetching } =
		useCommentContext();
	const { currentPlaylist } = useSelector(selectCurrentPlaylist);

	const { fetchComment } = useGetComment({
		setIsFetchingFromParent: setIsFetching,
	});

	const handleGetPlaylistComment = async () => {
		if (!currentPlaylist) return;

		const comments = await fetchComment({
			target_id: currentPlaylist.id,
		});

		if (comments) setComments(comments);
		else setComments([]);
	};

	useEffect(() => {
		if (!isOpenComment || !currentPlaylist) return;

		if (shouldFetchComment.current) {
			shouldFetchComment.current = false;

			handleGetPlaylistComment();
		}
	}, [isOpenComment]);
}

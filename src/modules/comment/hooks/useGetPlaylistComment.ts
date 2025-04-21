import { useEffect } from "react";
import { useCommentContext } from "../components/CommemtContext";
import { useSelector } from "react-redux";
import useGetComment from "./useGetComment";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

export default function useGetPlaylistComment() {
	const { shouldFetchComment, setComments, isOpenComment } = useCommentContext();
	const { currentPlaylist } = useSelector(selectCurrentPlaylist);

	const { fetchComment } = useGetComment();

	const handleGetSongComment = async () => {
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

			handleGetSongComment();
		}
	}, [isOpenComment]);
}

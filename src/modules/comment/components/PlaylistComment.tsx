import CommentList from "..";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Center } from "@/components";
import { useCommentContext } from "./CommemtContext";
import useGetPlaylistComment from "../hooks/useGetPlaylistComment";

export default function PlaylistComment() {
	const { isFetching, comments } = useCommentContext();

	useGetPlaylistComment();

	if (isFetching)
		return (
			<Center>
				<ArrowPathIcon className="w-6 animate-spin" />
			</Center>
		);

	return <CommentList comments={comments} />;
}

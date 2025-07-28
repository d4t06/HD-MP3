import CommentList from "..";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Center } from "@/components";
import { useCommentContext } from "./CommentContext";
import useGetPlaylistComment from "../hooks/useGetPlaylistComment";
import UserInput from "./UserInput";

type Props = {
	targetId: string;
};

export default function PlaylistComment({ targetId }: Props) {
	const { isFetching, comments } = useCommentContext();

	useGetPlaylistComment();

	if (isFetching)
		return (
			<Center>
				<ArrowPathIcon className="w-6 animate-spin" />
			</Center>
		);

	return (
		<>
			<CommentList comments={comments} />
			<UserInput variant="comment" targetId={targetId} />
		</>
	);
}

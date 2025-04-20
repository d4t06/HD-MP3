import CommentList from "..";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Center } from "@/components";
import { useCommentContext } from "./CommemtContext";

export default function SongComment() {
	const { isFetching, comments } = useCommentContext();

	if (isFetching)
		return (
			<Center>
				<ArrowPathIcon className="w-6 animate-spin" />
			</Center>
		);

	return <CommentList comments={comments} />;
}

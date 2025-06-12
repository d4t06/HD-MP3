import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useCommentContext } from "./CommentContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetComment } from "@/hooks";

type Props = {
	commentIndex: number;
	comment: UserComment;
};

export default function GetReplyBtn({ comment, commentIndex }: Props) {
	const { comments, setComments } = useCommentContext();
	const [isFetching, setIsFetching] = useState(false);

	const { fetchComment } = useGetComment();

	const handleGetReply = async () => {
		try {
			setIsFetching(true);

			const replies = await fetchComment({
				comment_id: comment.id,
			});

			if (replies) {
				const newComments = [...comments];

				newComments[commentIndex] = {
					...newComments[commentIndex],
					replies,
				};

				setComments(newComments);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<button
			onClick={handleGetReply}
			className="mt-1 text-[#ccc] flex items-center space-x-1"
		>
			<span>View {comment.reply} replies</span>

			{isFetching ? (
				<ArrowPathIcon className="w-5 animate-spin" />
			) : (
				<ChevronDownIcon className="w-5" />
			)}
		</button>
	);
}

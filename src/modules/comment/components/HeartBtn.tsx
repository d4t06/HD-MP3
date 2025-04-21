import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import useCommentAction from "../hooks/useCommentAction";
import { useAuthContext } from "@/stores";

type Props = {
	comment: UserComment;
};

export default function HeartButton({ comment }: Props) {
	const { user } = useAuthContext();
	const { action, isFetching } = useCommentAction();

	const isLiked = user?.liked_comment_ids.includes(comment.id);

	return (
		<button className="flex flex-col" onClick={() => action({ type: "like", id: comment.id })}>
			{isFetching ? (
				<ArrowPathIcon className="w-6 animate-spin" />
			) : (
				<>
					{isLiked ? (
						<HeartIconSolid className={`w-6 text-red-[500]`} />
					) : (
						<HeartIcon className="w-6" />
					)}
				</>
			)}
		</button>
	);
}

import { ConfirmModal, Image, Modal, ModalRef } from "@/components";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/stores";
import useCommentAction from "../hooks/useCommentAction";
import { useRef } from "react";

type Props = {
	comment: UserComment;
	index: number;
};

function daysSinceTimestamp(timestamp: Timestamp) {
	const date = timestamp.toDate();
	const now = new Date();

	const differenceInMilliseconds = now.getTime() - date.getTime();
	const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

	if (differenceInDays) return differenceInDays + " days ago";
	return "Today";
}

export default function CommentItem({ comment, index }: Props) {
	const { user } = useAuthContext();

	const { action, isFetching } = useCommentAction();

	const currentAction = useRef<"like" | "delete">("like");
	const modalRef = useRef<ModalRef>(null);

	const isLiked = user?.liked_comment_ids.includes(comment.id);
	const isOwner = user?.email === comment.user_email;

	const handleDeleteComment = async () => {
		await action({
			type: "delete",
			id: comment.id,
			index,
		});

		modalRef.current?.close();
	};

	return (
		<>
			<div className="p-2 text-white">
				<div className="flex w-full items-start space-x-1.5">
					<div className="flex-shrink-0 w-[48px] h-[48px] rounded-full overflow-hidden">
						<Image src={comment.user_image_url} />
					</div>

					<div className="flex-grow">
						<div className="p-2 rounded-md bg-[#2f2f2f]">
							<Link className="text-[#ccc] line-clamp-1 text-sm font-[500]" to={"/"}>
								{comment.user_name}
							</Link>
							<div className="mt-1.5 break-all text-white">{comment.text}</div>
						</div>

						<div className="flex space-x-2 text-sm mt-1">
							<span className="text-[#ccc]">
								{daysSinceTimestamp(comment.created_at)}
							</span>

							{isOwner ? (
								<button
									onClick={() => {
										currentAction.current = "delete";
										modalRef.current?.open();
									}}
								>
									Delete
								</button>
							) : (
								<button>Reply</button>
							)}
						</div>

						{!!comment.reply && (
							<button className="mt-1 text-[#ccc] text-sm flex items-center space-x-1">
								<span>View {comment.replies.length} replies</span>
								<ChevronDownIcon className="w-5" />
							</button>
						)}
					</div>

					<div className="flex flex-col items-center">
						<button
							className="p-1"
							onClick={() => {
								currentAction.current = "like";
								action({ type: "like", id: comment.id });
							}}
						>
							{isFetching && currentAction.current === "like" ? (
								<ArrowPathIcon className="w-6 animate-spin" />
							) : (
								<>
									{isLiked ? (
										<HeartIconSolid className={`w-6 text-red-500`} />
									) : (
										<HeartIcon className="w-6" />
									)}
								</>
							)}
						</button>
						<span>{comment.like}</span>
					</div>
				</div>
			</div>

			<Modal variant="animation" ref={modalRef}>
				<ConfirmModal
					label="Delete comment"
					close={() => modalRef.current?.close}
					loading={isFetching}
					callback={handleDeleteComment}
				/>
			</Modal>
		</>
	);
}

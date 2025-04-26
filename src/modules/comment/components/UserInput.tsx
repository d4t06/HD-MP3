import { Button, Image, Input } from "@/components";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import useCommentAction from "../hooks/useCommentAction";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useCommentContext } from "./CommemtContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useAuthContext } from "@/stores";

type Props = {
	onSubmited?: () => void;
};

type SendComment = {
	variant: "comment";
};

type SendReply = {
	variant: "reply";
	comment: UserComment;
	comment_index: number
};

export default function UserInput({
	onSubmited,
	...props
}: (SendComment | SendReply) & Props) {
	const { user } = useAuthContext();

	const { target } = useCommentContext();
	const { currentSongData } = useSelector(selectSongQueue);
	const { currentPlaylist } = useSelector(selectCurrentPlaylist);

	const { action, isFetching } = useCommentAction();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleAddComment = async () => {
		if (!inputRef.current) return;

		const value = inputRef.current.value;
		if (!value || !value.trim()) return;

		if (
			(target === "song" && !currentSongData) ||
			(target === "playlist" && !currentPlaylist)
		)
			return;

		const targetId = target === "song" ? currentSongData?.song.id : currentPlaylist?.id;
		if (!targetId) return;

		switch (props.variant) {
			case "comment":
				await action({
					type: "add",
					target_id: targetId,
					text: value,
				});

				break;
			case "reply":
				await action({
					type: "reply",
					text: value,
					comment: props.comment,
					comment_index: props.comment_index
				});

				break;
		}

		inputRef.current.value = "";

		onSubmited && onSubmited();
	};

	const inputPlaceholder =
		props.variant === "comment" ? "..." : `Reply to ${props.comment.user_name}...`;

	return (
		<div className="flex w-full">
			<div className="w-[40px] h-[40px] flex-shrink-0">
				<Image src={user?.photo_url} className="rounded-full" />
			</div>

			<div className="rounded-lg ml-2 flex-grow bg-[#333] flex items-center">
				<Input
					className="bg-transparent border-none"
					placeholder={inputPlaceholder}
					ref={inputRef}
				/>
				<Button onClick={handleAddComment} className="" isLoading={isFetching}>
					<PaperAirplaneIcon className="w-5" />
				</Button>
			</div>
		</div>
	);
}

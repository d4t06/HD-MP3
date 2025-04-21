import { Button, Input } from "@/components";
import { ArrowPathIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import useCommentAction from "../hooks/useCommentAction";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useCommentContext } from "./CommemtContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

export default function UserInput() {
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

		await action({
			type: "add",
			target_id: targetId,
			text: value,
		});

		inputRef.current.value = "";
	};

	return (
		<div className="flex w-full z-0">
			<Input placeholder="..." ref={inputRef} />
			<Button
				onClick={handleAddComment}
				className="ml-2 w-[70px] justify-center"
				isLoading={isFetching}
				color="primary"
				rounded={"full"}
			>
				<MusicalNoteIcon className="w-5" />
			</Button>
		</div>
	);
}

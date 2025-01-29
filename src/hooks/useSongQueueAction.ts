import { useDispatch } from "react-redux";

import { useToast } from "@/store";
import { addSongToQueue, removeSongFromQueue } from "@/store/songQueueSlice";

export default function useSongQueueAction() {
	const dispatch = useDispatch();

	const { setSuccessToast } = useToast();

	type RemoveFromQueue = {
		variant: "remove";
		index: number;
	};

	type AddToQueue = {
		variant: "add";
		songs: Song[];
	};

	const action = (props: AddToQueue | RemoveFromQueue) => {
		switch (props.variant) {
			case "add":
				dispatch(addSongToQueue({ songs: props.songs }));
				setSuccessToast("Song added to queue");
				break;
			case "remove":
				dispatch(
					removeSongFromQueue({
						index: props.index,
					}),
				);
		}
	};

	return { action };
}

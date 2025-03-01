import { useDispatch } from "react-redux";

import { useToastContext } from "@/stores";
import { addSongToQueue, removeSongFromQueue } from "@/stores/redux/songQueueSlice";

export default function useSongQueueAction() {
	const dispatch = useDispatch();

	const { setSuccessToast } = useToastContext();

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

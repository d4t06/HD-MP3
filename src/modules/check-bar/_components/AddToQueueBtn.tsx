import { PlusIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { useSongSelectContext, useToastContext } from "@/stores";
import { addSongToQueue } from "@/stores/redux/songQueueSlice";

export default function AddToQueueCheckBarItem() {
	const dispatch = useDispatch();
	const { setSuccessToast } = useToastContext();
	const { selectedSongs, resetSelect } = useSongSelectContext();

	const addSongsToQueue = () => {
		dispatch(addSongToQueue({ songs: selectedSongs }));
		setSuccessToast("songs added to queue");
		resetSelect();
	};

	return (
		<button onClick={addSongsToQueue}>
			<PlusIcon className="w-5" />
			<span className="">Add to queue</span>
		</button>
	);
}

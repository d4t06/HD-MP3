import { useToastContext } from "@/stores";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { addSongToQueue } from "@/stores/redux/songQueueSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";

export default function AddToQueueMenuItem() {
	const dispatch = useDispatch();
	const { playlistSongs } = useSelector(selectCurrentPlaylist);
	const { setSuccessToast } = useToastContext();

	return (
		<button
			onClick={() => {
				dispatch(
					addSongToQueue({
						songs: playlistSongs,
					}),
				);

				setSuccessToast("Song added to queue");
			}}
		>
			<PlusIcon />
			<span>Add to queue</span>
		</button>
	);
}

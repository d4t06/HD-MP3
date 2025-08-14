import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { QueueTab } from "..";
import { Button } from "@/components";
import SongList from "@/modules/song-item/_components/SongList";
import { useDispatch } from "react-redux";
import {
	addSongToQueue,
	setCurrentQueueId,
} from "@/stores/redux/songQueueSlice";
import useGetRecentSong from "../_hooks/useGetRecentSongs";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SongSkeleton } from "@/components/skeleton";

type Props = {
	setTab: Dispatch<SetStateAction<QueueTab>>;
};

export default function RecentSong({ setTab }: Props) {
	const dispatch = useDispatch();
	const ranEffect = useRef(false);

	const { getRecentSongs, isFetching, recentSongs, clearRecentSongs } =
		useGetRecentSong();

	const handleSetSong = (song: Song) => {
		dispatch(
			addSongToQueue({
				songs: [song],
			}),
		);

		dispatch(setCurrentQueueId(song.queue_id));

		setTab("Queue");
	};

	useEffect(() => {
		if (!ranEffect.current) {
			ranEffect.current = true;
			getRecentSongs();
		}
	}, []);

	if (isFetching)
		return <SongSkeleton variant="queue-song" hasCheckBox={false} />;

	return (
		<>
			<SongList
				isHasCheckBox={false}
				songVariant="recent-song"
				songs={recentSongs}
				setSong={handleSetSong}
			/>

			<div className="text-center my-3">
				{!!recentSongs.length && (
					<Button onClick={clearRecentSongs} color="primary">
						<TrashIcon className="w-6" />
						<span className="">Clear</span>
					</Button>
				)}
			</div>
		</>
	);
}

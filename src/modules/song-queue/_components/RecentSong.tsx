import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { QueueTab } from "..";
import { Skeleton } from "@/components";
import SongList from "@/modules/song-item/_components/SongList";
import { useDispatch } from "react-redux";
import { addSongToQueue, setCurrentQueueId } from "@/stores/redux/songQueueSlice";
import useGetRecentSong from "@/hooks/useGetRecentSongs";

type Props = {
	setTab: Dispatch<SetStateAction<QueueTab>>;
};

export default function RecentSong({ setTab }: Props) {
	const dispatch = useDispatch();
	const ranEffect = useRef(false);

	const { getRecentSongs, isFetching, recentSongs } = useGetRecentSong();

	const skeleton = [...Array(5).keys()].map((i) => (
		<Skeleton key={i} className="h-[57px] mt-1" />
	));

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

	if (isFetching) return skeleton;

	return (
		<SongList
			isHasCheckBox={false}
			songVariant="recent-song"
			songs={recentSongs}
			setSong={handleSetSong}
		/>
	);
}

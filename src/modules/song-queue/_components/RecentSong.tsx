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
	// const { user } = useAuthContext();

	// const [recentSongs, setRecentSongs] = useState<Song[]>([]);
	// const [isFetching, setIsFetching] = useState(true);

	const ranEffect = useRef(false);

	const { getRecentSongs, isFetching, recentSongs } = useGetRecentSong();

	const skeleton = [...Array(5).keys()].map((i) => (
		<Skeleton key={i} className="h-[56px] mt-1" />
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

	// const getRecentSong = async () => {
	// 	try {
	// 		if (user && user.recent_song_ids.length) {
	// 			const queryGetRecentSongs = query(
	// 				songsCollectionRef,
	// 				where(documentId(), "in", user.recent_song_ids),
	// 			);

	// 			const result = await implementSongQuery(queryGetRecentSongs);

	// 			setRecentSongs(result);
	// 		} else {
	// 			const songs: Song[] = getLocalStorage()["recent-songs"] || [];

	// 			await sleep(100);

	// 			setRecentSongs(songs);
	// 		}
	// 	} catch (error) {
	// 		console.log({ message: error });
	// 	} finally {
	// 		setIsFetching(false);
	// 	}
	// };

	useEffect(() => {
		if (!ranEffect.current) {
			ranEffect.current = true;
			getRecentSongs();
		}
	}, []);

	if (isFetching) return skeleton;

	return <SongList songs={recentSongs} setSong={handleSetSong} />;
}

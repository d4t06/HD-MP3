import { getRelativeSongs } from "@/services/getRelativeSongs";
import {
	addSongToQueue,
	setIsFetchingRecommend,
} from "@/stores/redux/songQueueSlice";
import { useDispatch } from "react-redux";

export default function useGetRelativeSongs() {
	const dispatch = useDispatch();

	const getRelatigeSongs = async (song: Song) => {
		try {
			if (import.meta.env.DEV) console.log("getRelatigeSongs");

			dispatch(setIsFetchingRecommend(true));

			const result = await getRelativeSongs(song);

			dispatch(
				addSongToQueue({
					songs: result,
				}),
			);
		} catch (error) {
			console.log(error);
		}
	};

	return { getRelatigeSongs };
}

import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import {
	addSongToQueue,
	setIsFetchingRecommend,
} from "@/stores/redux/songQueueSlice";
import { query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";

export default function useGetRecommend() {
	const dispatch = useDispatch();

	const getRecommend = async (song: Song) => {
		try {
			if (import.meta.env.DEV) console.log("getRecommend");

			const relativeSongs: Song[] = [];

			dispatch(setIsFetchingRecommend(true));

			const q = query(
				songsCollectionRef,
				where("main_genre.id", "==", song.main_genre?.id),
				where("genre_ids", "array-contains-any", song.genre_ids),
				where("release_year", ">=", song.release_year - 1),
				where("release_year", "<=", song.release_year + 1),
			);

			const result = await implementSongQuery(q);

			relativeSongs.push(...result);

			const songs = relativeSongs.filter((s) => s.id !== song.id);

			if (relativeSongs.length)
				dispatch(
					addSongToQueue({
						songs,
					}),
				);
		} catch (error) {
			console.log(error);
		}
	};

	return { getRecommend };
}

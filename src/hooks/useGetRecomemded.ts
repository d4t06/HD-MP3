import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import {
	addSongToQueue,
	selectSongQueue,
	setIsFetchingRecommend,
} from "@/stores/redux/songQueueSlice";
import { documentId, limit, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

export default function useGetRecommend() {
	const dispatch = useDispatch();
	const {} = useSelector(selectSongQueue);

	const getRecommend = async (song: Song) => {
		try {
			dispatch(setIsFetchingRecommend(true));

			const wheres = song.genres.map(
				(g) => where(`genre_map.${g.id}`, "==", true),
				limit(20),
			);

			const exceptQuery = where(documentId(), "!=", song.id);

			const queryGetSongs = query(songsCollectionRef, ...wheres, exceptQuery);

			const result = await implementSongQuery(queryGetSongs);

			dispatch(
				addSongToQueue({
					songs: result,
				}),
			);

			dispatch(setIsFetchingRecommend(false));
		} catch (error) {}
	};

	return { getRecommend };
}

import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import {
	addSongToQueue,
	setIsFetchingRecommend,
} from "@/stores/redux/songQueueSlice";
import { and, documentId, limit, or, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";

export default function useGetRecommend() {
	const dispatch = useDispatch();

	const getRecommend = async (song: Song) => {
		try {
			dispatch(setIsFetchingRecommend(true));
			const singers = song.singers.map((s) =>
				where(`singer_map.${s.id}`, "==", true),
			);

			const singerSongs = await implementSongQuery(
				query(songsCollectionRef, ...singers),
			);

			const exceptSongIds = singerSongs.map((s) => s.id);

			const exceptCondition = where(documentId(), "not-in", [
				song.id,
				...exceptSongIds,
			]);

			const genreConditions = song.genres.map((g) =>
				where(`genre_map.${g.id}`, "==", true),
			);

			/**
			Matches all songs that contain at least 1 singer_id of target song in singer_map is true 
			Matches all songs that contain at least 1 genre_id of target song in genre_map is true 
			and except the current song
			**/

			const otherSongQuery = query(
				songsCollectionRef,
				and(
					exceptCondition,
					or(...genreConditions),
					where("release_year", ">=", song.release_year - 2),
					where("release_year", "<=", song.release_year + 2),
				),
				limit(100),
			);

			const result = await implementSongQuery(otherSongQuery);

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

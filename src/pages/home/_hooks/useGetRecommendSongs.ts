import { implementSongQuery } from "@/services/appService";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { getRelativeSongs } from "@/services/getRelativeSongs";
import { useAuthContext } from "@/stores";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetRecommendSongs() {
	const [songs, setSongs] = useState<Song[]>([]);

	const { user, loading } = useAuthContext();

	const [isFetching, setIsFetching] = useState(true);

	const ranEffect = useRef(false);

	const getRecomemdedSongs = async () => {
		try {
			setIsFetching(true);

			let recomemdedSongs: Song[] = [];

			if (user) {
				setLocalStorage("recent-songs", []);
				const recentSongIds = [...user.recent_song_ids];

				const songId =
					recentSongIds[Math.floor(Math.random() * recentSongIds.length)];

				const songSnap = await myGetDoc({
					collectionName: "Songs",
					id: songId,
				});

				if (songSnap.exists()) {
					const song: Song = {
						...(songSnap.data() as SongSchema),
						id: songSnap.id,
						queue_id: "",
					};

					const relativeSongs = await getRelativeSongs(song);

					if (relativeSongs.length) recomemdedSongs = relativeSongs;
				}
			} else {
				const recentSongs = (getLocalStorage()["recent-songs"] || []) as Song[];

				if (recentSongs.length) {
					const song =
						recentSongs[Math.floor(Math.random() * recentSongs.length)];

					const relativeSongs = await getRelativeSongs(song);
					if (relativeSongs.length) recomemdedSongs = relativeSongs;
					else recomemdedSongs = recentSongs;
				}
			}

			// get new songs
			if (!recomemdedSongs.length) {
				const q = query(
					songsCollectionRef,
					where("is_official", "==", true),
					orderBy("updated_at", "desc"),
					limit(8),
				);
				const result = await implementSongQuery(q, {
					msg: "useGetRecommendSongs, get new songs",
				});

				recomemdedSongs = result;
			}

			setSongs(recomemdedSongs);
		} catch (error) {
			console.log(error);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (loading) return;

		if (!ranEffect.current) {
			ranEffect.current = true;

			getRecomemdedSongs();
		}
	}, [loading]);

	return { songs, getRecomemdedSongs, isFetching };
}

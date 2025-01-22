import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase";
// import { nanoid } from "nanoid";
import { devSongs } from "@/constants/songs";
import { sleep } from "@/utils/appHelpers";

export default function useAddSingerButton() {
	const [value, setValue] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [searchResult, SetSearchResult] = useState<String[]>([]);

	const isEmpty = useRef(false);

	const searchKey = useDebounce(value, 700);

	const controller = new AbortController();

	// do search
	useEffect(() => {
		if (!searchKey.trim()) {
			setIsFetching(false);
			SetSearchResult([]);
			return;
		}

		const fetchApi = async () => {
			try {
				setIsFetching(true);

				await sleep(1000);
				isEmpty.current = true;
				SetSearchResult([]);

				// const songLstCollectionRef = collection(db, "playlist");

				// const querySearchSong = query(songLstCollectionRef, where("by", "==", "admin"));

				// const songsSnap = await getDocs(querySearchSong);

				// if (songsSnap.docs) {
				//   const songs = songsSnap.docs.map(
				//     (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) }) as Song,
				//   );

				//   SetSearchResult(songs);
				// }
			} catch (error) {
				console.log(error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchApi();

		return () => {
			console.log("abort");
			controller.abort();
		};
	}, [searchKey]);

	useEffect(() => {
		return () => {
			isEmpty.current = false;
		};
	}, [value]);

	return {
		isFetching,
		searchResult,
		value,
		setValue,
		isEmpty,
	};
}

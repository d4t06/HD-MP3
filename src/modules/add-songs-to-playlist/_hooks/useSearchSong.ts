import { implementSongQuery } from "@/services/appService";
import { getSearchQuery, songsCollectionRef } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { limit, orderBy, query, where } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";

const tabs = ["Newest", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useSearchSong() {
	const {
		uploadedSongs,
		setUploadedSongs,
		shouldFetchUserSongs,
		lastDoc,
		PAGE_SIZE,
		setHasMore,
	} = useSongContext();

	const [tab, setTab] = useState<Tab>("Newest");

	const [result, setResult] = useState<Song[]>([]);

	const [value, setValue] = useState("");
	const [isFetching, setIsFetching] = useState(false);

	const { setErrorToast } = useToastContext();

	const getNewestSongs = async () => {
		try {
			setIsFetching(true);

			setHasMore((prev) => {
				const isFetchedMoreAndNoMore = lastDoc.current && !prev;

				if (isFetchedMoreAndNoMore) {
					lastDoc.current = undefined;
					return !prev;
				}

				return prev;
			});

			const q = query(
				songsCollectionRef,
				where("is_official", "==", true),
				orderBy("updated_at", "desc"),
				limit(PAGE_SIZE),
			);

			const result = await implementSongQuery(q);
			setUploadedSongs(result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsFetching(false);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();

			setIsFetching(true);

			setTab("Result");

			const q = getSearchQuery(
				songsCollectionRef,
				[where("is_official", "==", true)],
				value,
			);

			const result = await implementSongQuery(q);

			setResult(result);
		} catch (err) {
			console.log({ message: err });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (shouldFetchUserSongs.current) {
			shouldFetchUserSongs.current = false;

			getNewestSongs();
		}
	}, []);

	return {
		isFetching,
		value,
		getNewestSongs,
		result,
		uploadedSongs,
		setValue,
		handleSubmit,
		tabs,
		tab,
		setTab,
	};
}

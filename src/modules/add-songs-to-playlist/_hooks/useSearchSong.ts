import { implementSongQuery } from "@/services/appService";
import { getSearchQuery, songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { where } from "firebase/firestore";
import { FormEvent, useState } from "react";

export default function useSearchSong() {
	const [songs, setSongs] = useState<Song[]>([]);

	const [value, setValue] = useState("");
	const [isFetching, setIsFetching] = useState(false);

	const { setErrorToast } = useToastContext();

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();

			setIsFetching(true);

			const q = getSearchQuery(
				songsCollectionRef,
				[where("is_official", "==", true)],
				value,
			);

			const result = await implementSongQuery(q);

			setSongs(result);
		} catch (err) {
			console.log({ message: err });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { isFetching, value, songs, setValue, handleSubmit };
}

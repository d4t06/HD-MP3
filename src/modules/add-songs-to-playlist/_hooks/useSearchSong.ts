import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { query, where } from "firebase/firestore";
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

			const searchQuery = query(
				songsCollectionRef,
				where("name", ">=", value),
				where("name", "<=", value + "\uf8ff"),
				where("is_official", "==", true),
			);

			const result = await implementSongQuery(searchQuery);

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

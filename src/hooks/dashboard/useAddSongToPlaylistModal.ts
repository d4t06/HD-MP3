import { searchSong } from "@/services/appService";
import { useSongSelectContext, useToast } from "@/store";
import { FormEvent, useState } from "react";
import useDashboardPlaylistActions from "./useDashboardPlaylistActions";

export default function useAddSongToPlaylistModal() {
	const [value, setValue] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [songs, setSongs] = useState<Song[]>([]);

	const { selectedSongs, selectSong } = useSongSelectContext();

	const { actions, isFetching: actionFetching } = useDashboardPlaylistActions();
	const { setErrorToast } = useToast();

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();

			setIsFetching(true);

			const songs = await searchSong(value);

			if (songs) setSongs(songs);
		} catch (err) {
			console.log({ message: err });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	const handleAddSongsToPlaylist = async () => {
		if (!selectedSongs.length) return;
		await actions({ variant: "add-songs", songs: selectedSongs });
	};

	return {
		value,
		setValue,
		isFetching,
		handleSubmit,
		handleAddSongsToPlaylist,
		songs,
		selectedSongs,
		selectSong,
		actionFetching,
	};
}

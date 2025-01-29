import { useState } from "react";
import { useSongContext, useToast } from "@/store";
import { generateId, initPlaylistObject } from "@/utils/appHelpers";
import { myDeleteDoc, mySetDoc } from "@/services/firebaseService";

export default function usePlaylistAction() {
	// store

	const { setPlaylists } = useSongContext();

	// state
	const [isFetching, setIsFetching] = useState(false);

	// hooks
	const { setErrorToast } = useToast();

	const handleAddPlaylist = async (playlistName: string) => {
		try {
			if (!playlistName) throw new Error("playlist name invalid");

			const playlistId = generateId(playlistName) + "_admin";

			const addedPlaylist = initPlaylistObject({
				id: playlistId,
				by: "admin",
				name: playlistName,
			});

			setIsFetching(true);

			await mySetDoc({
				collection: "playlist",
				data: addedPlaylist,
				id: playlistId,
				msg: ">>> api: set playlist doc",
			});

			setPlaylists((prev) => [...prev, addedPlaylist]);
		} catch (error) {
			console.log({ message: error });
			setErrorToast("");
		} finally {
			setIsFetching(false);
		}
	};

	const handleDeletePlaylist = async (id: string) => {
		setIsFetching(true);

		// >>> api
		await myDeleteDoc({
			collection: "playlist",
			id: id,
			msg: ">>> api: delete playlist doc",
		});



		setIsFetching(false);
	};

	return {
		isFetching,
		handleAddPlaylist,
		handleDeletePlaylist,
	};
}

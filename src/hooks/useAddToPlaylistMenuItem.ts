import { useState } from "react";
import { useToastContext } from "../stores";
import { mySetDoc } from "@/services/firebaseService";

export default function useAddPlaylistMenuItem() {
	// stores
	const { setErrorToast, setSuccessToast } = useToastContext();

	// state
	const [isFetching, setIsFetching] = useState(false);

	type Props = {
		song: Song;
		playlist: Playlist;
	};

	const addToPlaylist = async ({ playlist, song }: Props) => {
		try {
			setIsFetching(true);

			const id = playlist.song_ids.find((id) => id === song.id);

			if (!id) {
				const newSongIds = [...playlist.song_ids, song.id];

				await mySetDoc({
					collection: "playlist",
					id: playlist.id,
					data: { song_ids: newSongIds } as Partial<Playlist>,
					msg: ">>> api: update playlist doc",
				});
			}

			setSuccessToast(`' ${song.name} added to playlist ' ${playlist.name} '`);
		} catch (error) {
			console.log({ message: error });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return {
		isFetching,
		addToPlaylist,
	};
}

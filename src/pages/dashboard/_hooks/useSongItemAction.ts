import { deleteSong } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { useState } from "react";

type DeleteSong = {
	variant: "delete";
	song: Song;
};

export type SongItemActionProps = DeleteSong;

export default function useDashboardSongItemAction() {
	const { setUploadedSongs, uploadedSongs } = useSongContext();

	const [isFetching, setIsFetching] = useState(false);

	const { setSuccessToast, setErrorToast } = useToastContext();

	const actions = async (props: SongItemActionProps) => {
		try {
			setIsFetching(true);

			switch (props.variant) {
				case "delete": {
					const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

					await deleteSong(props.song);
					setUploadedSongs(newSongs);

					setSuccessToast(`'${props.song.name}' deleted`);

					break;
				}
			}
		} catch (err) {
			console.log({ message: err });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { actions, isFetching };
}

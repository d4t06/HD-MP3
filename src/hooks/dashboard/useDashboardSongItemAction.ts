import { deleteSong } from "@/services/firebaseService";
import { useSongContext, useToast } from "@/store";
import { useState } from "react";

type DeleteSong = {
	variant: "delete";
	song: Song;
};

export type SongItemActionProps = DeleteSong;

export default function useDashboardSongItemAction() {
	const { setSongs, songs } = useSongContext();

	const [isFetching, setIsFetching] = useState(false);

	const { setSuccessToast, setErrorToast } = useToast();

	const actions = async (props: SongItemActionProps) => {
		try {
			setIsFetching(true);

			switch (props.variant) {
				case "delete": {
					const newSongs = songs.filter((s) => s.id !== props.song.id);

					await deleteSong(props.song);
					setSongs(newSongs);

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

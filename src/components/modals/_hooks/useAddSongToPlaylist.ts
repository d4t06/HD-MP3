import { useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { generateId, initPlaylistObject } from "@/utils/appHelpers";
import { mySetDoc } from "@/services/firebaseService";

export default function useAddSongToPlaylist() {
	// stores
	const { user } = useAuthContext();
	const { playlists, setPlaylists } = useSongContext();

	// state
	const [isFetching, setIsFetching] = useState(false);

	const { setErrorToast, setSuccessToast } = useToastContext();

	type AddToPlaylist = {
		variant: "exist";
		song: Song;
		playlist: Playlist;
	};

	type CreatePlaylist = {
		variant: "create";
		name: string;
		song: Song;
	};

	const addToPlaylist = async ({ song, ...props }: AddToPlaylist | CreatePlaylist) => {
		try {
			if (!user) throw new Error("user not found");

			setIsFetching(true);

			switch (props.variant) {
				case "exist": {
					const { playlist } = props;

					setIsFetching(true);

					const newSongIds = [...playlist.song_ids, song.id];

					await mySetDoc({
						collection: "playlist",
						id: playlist.id,
						data: { song_ids: newSongIds } as Partial<Playlist>,
						msg: ">>> api: update playlist doc",
					});

					setSuccessToast(`Song added`);

					break;
				}
				case "create": {
					const { name } = props;

					const playlistId = generateId(name);

					const addedPlaylist = initPlaylistObject({
						id: playlistId,
						by: user.email,
						name: name,
						song_ids: [song.id],
					});

					const newPlaylists = [...playlists, addedPlaylist];

					await mySetDoc({
						collection: "playlist",
						data: addedPlaylist,
						id: playlistId,
						msg: ">>> api: set playlist doc",
					});

					setPlaylists(newPlaylists);
					setSuccessToast(`Playlist created`);

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

	return { isFetching, addToPlaylist };
}

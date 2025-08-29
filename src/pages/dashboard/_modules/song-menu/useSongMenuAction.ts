import { db } from "@/firebase";
import { myGetDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { writeBatch } from "firebase/firestore";
import { useState } from "react";

type AddToPlaylists = {
	variant: "add-to-playlists";
	song: Song;
	playlists: Playlist[];
};

export type PlaylistActionProps = AddToPlaylists;

export default function useSongMenuAction() {
	const { setErrorToast, setSuccessToast } = useToastContext();

	const [isFetching, setIsFetching] = useState(false);

	const action = async (props: PlaylistActionProps) => {
		try {
			setIsFetching(true);

			switch (props.variant) {
				case "add-to-playlists": {
					const { song, playlists } = props;

					const batch = writeBatch(db);

					const addSongToPlaylist = async (id: string) => {
						const playlistDoc = await myGetDoc({
							collectionName: "Playlists",
							id,
						});

						if (!playlistDoc.exists()) return;

						const playlistData = playlistDoc.data() as PlaylistSchema;
						if (playlistData.song_ids.includes(song.id)) return;

						const newPlaylistData: Partial<Playlist> = {
							song_ids: [...playlistData.song_ids, song.id],
						};

						batch.update(playlistDoc.ref, newPlaylistData);
					};

					await Promise.all(playlists.map((p) => addSongToPlaylist(p.id)));

					setSuccessToast("Add song to playlists successful");

					batch.commit();
				}
			}
		} catch (error) {
			console.log(error);
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { action, isFetching, setIsFetching };
}

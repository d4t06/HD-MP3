import { useState } from "react";
import { useToastContext } from "@/stores";
import {
	commentCollectionRef,
	deleteFile,
	myUpdateDoc,
} from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
// import { optimizeAndGetHashImage } from "@/services/appService";
import { doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { useAlbumContext } from "../AlbumContext";

type Delete = {
	variant: "delete";
};

type AddSongs = {
	variant: "add-songs";
	songs: Song[];
};

type RemoveSongs = {
	variant: "remove-songs";
	songs: Song[];
};

export type AlbumActionProps = Delete | AddSongs | RemoveSongs;

export default function useAlbumAction() {
	// stores
	// const { user } = useAuthContext();
	const { setErrorToast, setSuccessToast } = useToastContext();

	const { album, songs, setSongs, updatePlaylistData } = useAlbumContext();

	// state
	const [isFetching, setIsFetching] = useState(false);

	// hooks
	const navigate = useNavigate();

	const action = async (props: AlbumActionProps) => {
		try {
			if (!album) throw new Error("album not found");

			setIsFetching(true);

			switch (props.variant) {
				case "delete": {
					const batch = writeBatch(db);

					const playlistRef = doc(db, "Playlists", album.id);
					const commentSnap = await getDocs(
						query(commentCollectionRef, where("target_id", "==", album.id)),
					);

					// delete playlist doc
					batch.delete(playlistRef);

					// delete comments doc
					if (!commentSnap.empty) {
						console.log(`Delete ${commentSnap.docs.length} comments`);
						commentSnap.forEach((snap) => batch.delete(snap.ref));
					}

					await Promise.all([
						batch.commit(),
						album.image_file_id
							? deleteFile({ fileId: album.image_file_id })
							: () => {},
					]);

					// shouldGetPlaylists.current = true;
					// lastDoc.current = undefined;

					setSuccessToast("Delete album sucessful");

					navigate("/dashboard/album");

					break;
				}
				case "add-songs": {
					const newSongs = [...songs, ...props.songs];
					const newSongIds = newSongs.map((s) => s.id);

					const newAlbumData: Partial<Playlist> = {
						song_ids: newSongIds,
					};

					await myUpdateDoc({
						collectionName: "Playlists",
						id: album.id,
						data: newAlbumData,
						msg: ">>> api: update album doc",
					});

					updatePlaylistData(newAlbumData);

					setSongs(newSongs);
					setSuccessToast(`Songs added`);

					break;
				}

				case "remove-songs": {
					const removeSongIds = props.songs.map((s) => s.id);

					const newPlaylistSongs = songs.filter(
						(s) => !removeSongIds.includes(s.id),
					);

					const songsData: Partial<Playlist> = {
						song_ids: newPlaylistSongs.map((s) => s.id),
					};

					await myUpdateDoc({
						collectionName: "Playlists",
						id: album.id,
						data: songsData,
						msg: ">>> api: update album doc",
					});

					setSongs(newPlaylistSongs);
					setSuccessToast(`'${props.songs.length}' removed`);

					break;
				}
			}
		} catch (error) {
			console.log({ message: error });
			setErrorToast("");
		} finally {
			setIsFetching(false);
		}
	};

	return {
		isFetching,
		action,
	};
}

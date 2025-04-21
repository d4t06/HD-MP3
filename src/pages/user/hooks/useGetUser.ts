import { useToastContext } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { query, where } from "firebase/firestore";
import {
	myGetDoc,
	playlistCollectionRef,
	songsCollectionRef,
} from "@/services/firebaseService";
import { useParams } from "react-router-dom";
import { implementPlaylistQuery, implementSongQuery } from "@/services/appService";
import { nanoid } from "nanoid/non-secure";

export default function useGetUser() {
	const [user, setUser] = useState<User>();
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [isFetching, setIsFetching] = useState(true);

	const { setErrorToast } = useToastContext();

	const params = useParams();

	const ranEffect = useRef(false);

	const getUser = async () => {
		try {
			if (!params.id) return;

			const userSnap = await myGetDoc({ collectionName: "Users", id: params.id });
			if (!userSnap.exists()) return;

			const userData: User = { ...(userSnap.data() as User) };

			const queryGetPlaylists = query(
				playlistCollectionRef,
				where(`owner_email`, "==", userData.email),
			);
			const playlistsAndAlbums = await implementPlaylistQuery(queryGetPlaylists);

			const playlists: Playlist[] = [];
			const albums: Playlist[] = [];

			playlistsAndAlbums.forEach((p) =>
				p.is_album ? albums.push(p) : playlists.push(p),
			);

			setPlaylists(playlists);
			setUser(userData);
		} catch (error) {
			console.log({ error });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (!ranEffect.current) {
			ranEffect.current = true;

			getUser();
		}
	}, []);

	return { user, playlists, isFetching };
}

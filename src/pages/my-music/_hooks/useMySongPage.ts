import { useEffect, useState } from "react";
import useGetMyMusicPlaylist from "./useGetMyMusicPlaylist";
import useGetMyMusicSinger from "./useGetMyMusicSinger";
import useGetMyMusicSong from "./useGetMyMusicSong";
import { useAuthContext, useSongContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";
import { sleep } from "@/utils/appHelpers";

export default function useMySongPage() {
	const { checkEntireUser } = useSongContext();
	const { user, updateUserData } = useAuthContext();

	const [isFetching, setIsFetching] = useState(
		checkEntireUser.current ? false : true,
	);

	const { getPlaylist } = useGetMyMusicPlaylist();
	const { getSinger } = useGetMyMusicSinger();
	const { getSongs } = useGetMyMusicSong({
		tab: "favorite",
	});

	const checkEntirUserDoc = async () => {
		try {
			if (!user) return;

			if (import.meta.env.DEV) console.log("useMySongPage, check entire user");

			const [playlists, singers, songs] = await Promise.all([
				getPlaylist(),
				getSinger(),
				getSongs(),
			]);

			const newUserData: Partial<User> = {};

			if (playlists && playlists.length !== user.liked_playlist_ids.length)
				newUserData["liked_playlist_ids"] = playlists.map((p) => p.id);

			if (singers && singers.length !== user.liked_singer_ids.length)
				newUserData["liked_singer_ids"] = singers.map((s) => s.id);

			if (songs && songs.length !== user.liked_song_ids.length)
				newUserData["liked_song_ids"] = songs.map((s) => s.id);

			if (Object.entries(newUserData).length) {
				myUpdateDoc({
					collectionName: "Users",
					data: newUserData,
					id: user.email,
					msg: "update user data"
				});

				updateUserData(newUserData);
			}

			await sleep(1000);
		} catch (error) {
			console.log(error);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (!checkEntireUser.current) {
			checkEntireUser.current = true;

			checkEntirUserDoc();
		}
	}, []);

	return { isFetching };
}

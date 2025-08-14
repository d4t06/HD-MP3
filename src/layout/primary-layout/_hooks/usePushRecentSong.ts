import { myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";

export default function usePushRecentSong() {
	const { user, updateUserData } = useAuthContext();

	const pushRecentSong = async (song: Song) => {
		if (!song.is_official) return;

		if (user) {
			const recentSongIds = [...user.recent_song_ids];
			const founded = recentSongIds.includes(song.id);

			if (!founded) {
				if (import.meta.env.DEV) console.log("push recent songs");
				recentSongIds.unshift(song.id);

				const newUserData: Partial<User> = {
					recent_song_ids: recentSongIds.slice(0, 10),
				};

				updateUserData(newUserData);
				myUpdateDoc({
					collectionName: "Users",
					data: newUserData,
					id: user.email,
				});
			}
		} else {
			const newRecentSongs = (getLocalStorage()["recent-songs"] ||
				[]) as Song[];

			const founded = newRecentSongs.find((s) => s.id === song.id);

			if (!founded) newRecentSongs.unshift(song);

			setLocalStorage("recent-songs", newRecentSongs);
		}
	};

	return { pushRecentSong };
}

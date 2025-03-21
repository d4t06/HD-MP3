import { myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";

export default function useUpdateRecentPlaylist() {
  const { user, updateUserData } = useAuthContext();

  const updatePlaylist = async (playlist: Playlist) => {
    if (user) {
      const founded = user.recent_playlist_ids.find((id) => id === playlist.id);
      if (!founded) {
        const newUserRecentPlaylists = [...user.recent_playlist_ids, playlist.id];
        const newUserData: Partial<User> = {
          recent_playlist_ids: newUserRecentPlaylists,
        };

        await myUpdateDoc({
          collectionName: "Users",
          data: newUserData,
          id: user.email,
        });

        updateUserData(newUserData);
      }
    } else {
      const recentPlaylists: Playlist[] = getLocalStorage()["recent-playlists"] || [];
      const founded = recentPlaylists.find((p) => p.id === playlist.id);

      if (!founded) {
        recentPlaylists.push(playlist);
        setLocalStorage("recent-playlists", recentPlaylists);
      }
    }

    try {
    } catch (error) {
      console.log({ error });
    }
  };

  return { updatePlaylist };
}

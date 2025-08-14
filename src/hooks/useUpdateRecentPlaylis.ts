import { myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";

export default function useUpdateRecentPlaylist() {
  const { user, updateUserData } = useAuthContext();

  const pushRecentPlaylist = async (playlist: Playlist) => {
    try {
      if (user) {
        const founded = user.recent_playlist_ids.find(
          (id) => id === playlist.id,
        );
        if (!founded) {
          if (import.meta.env.DEV) console.log("Push recent playlists");

          const newUserRecentPlaylists = [
            playlist.id,
            ...user.recent_playlist_ids,
          ];
          const newUserData: Partial<User> = {
            // only store 4 playlist
            recent_playlist_ids: newUserRecentPlaylists.slice(0, 4),
          };

          await myUpdateDoc({
            collectionName: "Users",
            data: newUserData,
            id: user.email,
          });

          updateUserData(newUserData);
        }
      } else {
        const recentPlaylists: Playlist[] =
          getLocalStorage()["recent-playlists"] || [];
        const founded = recentPlaylists.find((p) => p.id === playlist.id);

        if (!founded) {
          if (import.meta.env.DEV) console.log("Push recent playlists");

          recentPlaylists.unshift(playlist);
          setLocalStorage("recent-playlists", recentPlaylists.slice(0, 4));
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return { pushRecentPlaylist };
}

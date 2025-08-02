import { useAddPlaylist } from "@/hooks";
// import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";
import { myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";

export default function useMyMusicAddPlaylist() {
  const { user } = useAuthContext();
  const { playlists, setPlaylists } = useSongContext();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const { addPlaylist, isFetching } = useAddPlaylist();
  // const { action, isFetching: actionFetching } = usePlaylistAction();

  // const IS_FETCHING = isFetching || actionFetching;

  const myMusicAddPlaylist = async (
    playlist: PlaylistSchema,
    imageFile?: File,
  ) => {
    try {
      if (!user) return;
      const newPlaylist = await addPlaylist(
        {
          variant: "add",
          playlist,
          imageFile,
        },
        { push: false },
      );
      if (newPlaylist) {
        const newPlaylists = [...playlists, newPlaylist as Playlist];

        const newUserData: Partial<User> = {
          liked_playlist_ids: newPlaylists.map((s) => s.id),
        };

        await myUpdateDoc({
          collectionName: "Users",
          data: newUserData,
          id: user.email,
        });

        setPlaylists(newPlaylists);

        setSuccessToast("New playlist created");
      }
    } catch (error) {
      console.log({ error });
      setErrorToast();
    }
  };

  return { isFetching, myMusicAddPlaylist };
}

import { useAddPlaylist } from "@/hooks";
// import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";
import { myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";

export default function useMyMusicAddPlaylist() {
  const { user, updateUserData } = useAuthContext();
  const {
    ownPlaylists,
    setOwnPlaylists,
    favoritePlaylists,
    setFavoritePlaylists,
  } = useSongContext();

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
        const newPlaylists = [...ownPlaylists, newPlaylist as Playlist];
        const newFavoritePlaylists = [
          ...favoritePlaylists,
          newPlaylist as Playlist,
        ];

        const newUserData: Partial<User> = {
          liked_playlist_ids: newFavoritePlaylists.map((s) => s.id),
        };

        myUpdateDoc({
          collectionName: "Users",
          data: newUserData,
          id: user.email,
        });

        updateUserData(newUserData);

        setOwnPlaylists(newPlaylists);
        setFavoritePlaylists(newFavoritePlaylists);

        setSuccessToast("New playlist created");
      }
    } catch (error) {
      console.log({ error });
      setErrorToast();
    }
  };

  return { isFetching, myMusicAddPlaylist };
}

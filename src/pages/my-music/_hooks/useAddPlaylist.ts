import { useAddPlaylist } from "@/hooks";
import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";
import { useAuthContext, useToastContext } from "@/stores";

export default function useMyMusicAddPlaylist() {
  const { user } = useAuthContext();

  const { setErrorToast } = useToastContext();

  const { handleAddPlaylist, isFetching } = useAddPlaylist();
  const { action, isFetching: actionFetching } = usePlaylistAction();

  const IS_FETCHING = isFetching || actionFetching;

  const myMusicAddPlaylist = async (playlist: PlaylistSchema, imageFile?: File) => {
    try {
      if (!user) return;
      const newPlaylist = await handleAddPlaylist(playlist, imageFile, { push: false });
      if (newPlaylist) await action({ variant: "like", playlist: newPlaylist });
    } catch (error) {
      console.log({ error });
      setErrorToast();
    }
  };

  return { isFetching: IS_FETCHING, myMusicAddPlaylist };
}

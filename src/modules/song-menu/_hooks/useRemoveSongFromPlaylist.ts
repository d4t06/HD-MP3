import { useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPlaylist,
  setPlaylistSong,
} from "@/stores/redux/currentPlaylistSlice";

// use in song menu
export default function useRemoveSongFromPlaylist() {
  const dispatch = useDispatch();
  const { playlistSongs, currentPlaylist } = useSelector(selectCurrentPlaylist);

  const { playlists, setPlaylists } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Props = {
    song: Song;
  };

  const removeSongFromPlaylist = async ({ song }: Props) => {
    try {
      if (!currentPlaylist) return;

      setIsFetching(true);

      const newPlaylistSongs = playlistSongs.filter((s) => s.id !== song.id);

      const newPlaylistData: Partial<PlaylistSchema> = {
        song_ids: newPlaylistSongs.map((s) => s.id),
      };

      const newPlaylist = { ...currentPlaylist, ...newPlaylistData };

      await myUpdateDoc({
        collectionName: "Playlists",
        id: currentPlaylist.id,
        data: newPlaylistData,
      });

      // update local playlist
      const newPlaylists = [...playlists];
      const index = newPlaylists.findIndex((p) => p.id === currentPlaylist.id);

      if (index !== -1) {
        newPlaylists[index] = newPlaylist;
        setPlaylists(newPlaylists);
      }

      dispatch(setPlaylistSong(newPlaylistSongs));

      setSuccessToast(`${song.name} removed`);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, removeSongFromPlaylist };
}

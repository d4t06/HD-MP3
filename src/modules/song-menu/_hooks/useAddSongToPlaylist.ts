import { useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";
import { sleep } from "@/utils/appHelpers";

// use in song menu
export default function useAddSongToPlaylist() {
  const { playlists, setPlaylists } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type AddToPlaylist = {
    songs: Song[];
    playlist: Playlist;
  };

  const addToPlaylist = async ({ songs, playlist }: AddToPlaylist) => {
    try {
      setIsFetching(true);

      const newSongIds = [...playlist.song_ids];

      songs.forEach((s) => {
        if (!newSongIds.includes(s.id)) newSongIds.push(s.id);
      });

      const noChangeAfterPush = newSongIds.length === playlist.song_ids.length;
      if (noChangeAfterPush) {
        await sleep(300);

        setSuccessToast(`Song added`);
        return;
      }

      const newPlaylistData: Partial<PlaylistSchema> = {
        song_ids: newSongIds,
      };

      const newPlaylist = { ...playlist, ...newPlaylistData };

      await myUpdateDoc({
        collectionName: "Playlists",
        id: playlist.id,
        data: newPlaylistData,
      });

      const newPlaylists = [...playlists];
      const index = newPlaylists.findIndex((p) => p.id === playlist.id);

      if (index !== -1) {
        newPlaylists[index] = newPlaylist;
        setPlaylists(newPlaylists);
      }

      setSuccessToast(`Song added`);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, addToPlaylist };
}

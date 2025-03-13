import { useState } from "react";
import { useSongContext, useToastContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";

// use in song menu
export default function useAddSongToPlaylist() {
  const { playlists, setPlaylists } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type AddToPlaylist = {
    song: Song;
    playlist: Playlist;
  };

  const addToPlaylist = async ({ song, playlist }: AddToPlaylist) => {
    try {
      setIsFetching(true);

      const newPlaylistData: Partial<PlaylistSchema> = {
        song_ids: [song.id, ...playlist.song_ids],
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

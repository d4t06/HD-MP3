import { useEffect, useRef, useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { myUpdateDoc, playlistCollectionRef } from "@/services/firebaseService";
import { sleep } from "@/utils/appHelpers";
import { query, where } from "firebase/firestore";
import { implementPlaylistQuery } from "@/services/appService";

// use in song menu
export default function useAddSongToPlaylist() {
  const { user } = useAuthContext();
  const { shouldFetchOwnPlaylists, setOwnPlaylists } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  type AddToPlaylist = {
    songs: Song[];
    playlist: Playlist;
  };

  const getPlaylists = async () => {
    try {
      if (!user) return;

      if (shouldFetchOwnPlaylists.current) {
        shouldFetchOwnPlaylists.current = false;
        const queryGetUserPlaylist = query(
          playlistCollectionRef,
          where("owner_email", "==", user.email),
          where("is_official", "==", false),
        );
        const result = await implementPlaylistQuery(
          queryGetUserPlaylist,
          "useGetMyMusicPlaylist, get user own playlists",
        );

        setOwnPlaylists(result);
      }
    } catch (error) {
      console.log(error);
    }
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

      // const newPlaylist = { ...playlist, ...newPlaylistData };

      await myUpdateDoc({
        collectionName: "Playlists",
        id: playlist.id,
        data: newPlaylistData,
      });

      // const newPlaylists = [...playlists];
      // const index = newPlaylists.findIndex((p) => p.id === playlist.id);

      // if (index !== -1) {
      //   newPlaylists[index] = newPlaylist;
      //   setPlaylists(newPlaylists);
      // }

      setSuccessToast(`Song added`);
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getPlaylists();
    }
  }, []);

  return { isFetching, addToPlaylist };
}

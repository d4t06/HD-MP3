import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { documentId, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useMyMusic() {
  const { user } = useAuthContext();
  const {
    // setSongs,
    setPlaylists,
    shouldFetchUserSongs,
    shouldFetchUserPlaylists,
    playlists,
    // songs,
  } = useSongContext();

  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const getSongAndPlaylist = async () => {
    if (!user) return;

    try {
      // if (shouldFetchUserSongs.current) {
      //   shouldFetchUserSongs.current = false;

      //   if (user.liked_song_ids.length) {
      //     const queryGetUserSongs = query(
      //       songsCollectionRef,
      //       where(documentId(), "in", user.liked_song_ids)
      //     );

      //     const songs = await implementSongQuery(queryGetUserSongs);
      //     setSongs(songs);
      //   }
      // }

      if (shouldFetchUserPlaylists.current) {
        shouldFetchUserPlaylists.current = false;

        if (user.liked_playlist_ids.length) {
          const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where(documentId(), "in", user.liked_playlist_ids),
          );

          const result = await implementPlaylistQuery(queryGetUserPlaylist);
          setPlaylists(result);
        }
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    console.log(shouldFetchUserPlaylists.current, shouldFetchUserSongs.current);

    if (shouldFetchUserSongs.current || shouldFetchUserPlaylists.current) {
      getSongAndPlaylist();
    } else {
      setTimeout(() => setIsFetching(false), 300);
    }
  }, [user]);

  return { isFetching, playlists, getSongAndPlaylist };
}

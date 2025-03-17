import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type Props = {
  tab: "favorite" | "uploaded";
};

export default function useGetMyMusicSong({ tab }: Props) {
  const { user } = useAuthContext();
  const {
    setUploadedSongs,
    setFavoriteSongs,
    shouldFetchUserSongs,
    shouldFetchFavoriteSongs,
    favoriteSongs,
    uploadedSongs,
  } = useSongContext();

  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const getSongs = async () => {
    if (!user) return;

    try {
      switch (tab) {
        case "favorite": {
          if (shouldFetchFavoriteSongs.current) {
            shouldFetchFavoriteSongs.current = false;
            if (user.liked_song_ids.length) {
              const queryGetFavoriteSongs = query(
                songsCollectionRef,
                where(documentId(), "in", user.liked_song_ids),
              );

              const result = await implementSongQuery(queryGetFavoriteSongs);
              const sortedSongs: Song[] = [];

              user.liked_song_ids.forEach((id) => {
                const song = result.find((s) => s.id === id);
                if (song) sortedSongs.push(song);
              });

              setFavoriteSongs(sortedSongs);
            }
          } else await sleep(100);

          break;
        }

        case "uploaded": {
          if (shouldFetchUserSongs.current) {
            shouldFetchUserSongs.current = false;
            const queryGetSongs = query(
              songsCollectionRef,
              where("owner_email", "==", user.email),
              where("is_official", "==", false),
            );

            const result = await implementSongQuery(queryGetSongs);

            setUploadedSongs(result);
          } else await sleep(100);
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
    getSongs();
  }, []);

  return { isFetching, uploadedSongs, favoriteSongs, user };
}

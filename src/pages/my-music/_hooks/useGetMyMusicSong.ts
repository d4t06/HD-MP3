import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

type Props = {
  tab: "favorite" | "uploaded";
};

export default function useGetMyMusicSong({ tab }: Props) {
  const { user } = useAuthContext();
  const {
    favoriteSongs,
    setUploadedSongs,
    setFavoriteSongs,
    shouldFetchUserSongs,
    shouldFetchFavoriteSongs,
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
              const chunkSize = 30;
              const chunks = [];
              for (let i = 0; i < user.liked_song_ids.length; i += chunkSize) {
                chunks.push(user.liked_song_ids.slice(i, i + chunkSize));
              }

              const favoriteSongs: Song[] = [];

              if (import.meta.env.DEV) console.log(chunks.length, "chunks");

              for (const chunk of chunks) {
                if (chunk.length > 0) {
                  const q = query(
                    songsCollectionRef,
                    where(documentId(), "in", chunk),
                  );

                  const result = await implementSongQuery(q);

                  favoriteSongs.push(...result);
                }
              }

              setFavoriteSongs(favoriteSongs);

              return favoriteSongs;
            }
          } else {
            await sleep(100);
            return favoriteSongs;
          }

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

  // useEffect(() => {
  //   getSongs();
  // }, []);

  return { isFetching, getSongs };
}

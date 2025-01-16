import { devPlaylists } from "@/constants/playlist";
import { devSongs } from "@/constants/songs";
import { sleep } from "@/utils/appHelpers";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// import { devSongs } from "@/constants/songs";
// import { devPlaylists } from "@/constants/playlist";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase";
// import { nanoid } from "nanoid";

export type SearchResultTab = "Song" | "Playlist";

type SearchResult = { songs: Song[]; playlists: Playlist[] };

export default function useGetSearchResult() {
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<SearchResultTab>("Song");

  const searchParams = useSearchParams();

  const [result, setResult] = useState<SearchResult>({ songs: [], playlists: [] });

  const getResult = async () => {
    try {
      if (!searchParams[0].get("q")) return;

      await sleep(1000);

      // const songsCollectionRef = collection(db, "songs");
      // const playlistCollectionRef = collection(db, "playlist");

      // let searchQuery;

      switch (tab) {
        case "Song": {
          // searchQuery = query(
          //   songsCollectionRef,
          //   where("name", "==", searchParams[0].get("q")),
          // );

          // const songsSnap = await getDocs(searchQuery);

          // if (songsSnap.docs) {
          //   const songs = songsSnap.docs.map(
          //     (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) }) as Song,
          //   );

          //   setResult({ songs, playlists: [] });
          // }

          setResult({ songs: devSongs, playlists: [] });

          break;
        }
        case "Playlist": {
          // searchQuery = query(
          //   playlistCollectionRef,
          //   where("name", "==", searchParams[0].get("q")),
          // );

          // const playlistSnap = await getDocs(searchQuery);

          // if (playlistSnap.docs) {
          //   const playlists = playlistSnap.docs.map((doc) => doc.data() as Playlist);

          //   setResult({ playlists, songs: [] });
          // }

          // if shouldUpdateResult.current;
          setResult({ songs: [], playlists: devPlaylists });

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
      // else shouldUpdateResult.current = true;
    }
  };

  // run get result
  useEffect(() => {
    getResult();

    return () => {
      setIsFetching(true);
    };
  }, [searchParams[0].get("q"), tab]);

  // reset tab
  useEffect(() => {
    return () => {
      setTab("Song");
    };
  }, [searchParams[0].get("q")]);

  return {
    isFetching,
    setIsFetching,
    tab,
    setTab,
    getResult,
    result,
  };
}

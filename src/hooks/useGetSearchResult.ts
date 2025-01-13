import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { devSongs } from "@/constants/songs";
import { devPlaylists } from "@/constants/playlist";
// import { collection, DocumentSnapshot, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase";
// import { nanoid } from "nanoid";
import { sleep } from "@/utils/appHelpers";

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

      //   const songsCollectionRef = collection(db, "songs");
      //   const playlistCollectionRef = collection(db, "playlist");

      //   let searchQuery;

      switch (tab) {
        case "Song":
          //   searchQuery = query(
          //     songsCollectionRef,
          //     where("name", "==", searchParams[0].get("q"))
          //   );

          //   const songsSnap = await getDocs(searchQuery);

          //   if (songsSnap.docs) {
          //     const songs = songsSnap.docs.map(
          //       (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) } as Song)
          //     );

          //     setResult({ songs });
          //   }

          setResult({ songs: devSongs, playlists: [] });

          break;
        case "Playlist":
          //   searchQuery = query(
          //     playlistCollectionRef,
          //     where("name", "==", searchParams[0].get("q"))
          //   );

          //   const playlistSnap = await getDocs(searchQuery);

          //   if (playlistSnap.docs) {
          //     const playlists = playlistSnap.docs.map((doc) => doc.data() as Playlist);

          //     setResult({ playlists });
          //   }

          setResult({ songs: [], playlists: devPlaylists });

          break;
      }

      setIsFetching(false);
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getResult();

    return () => {
      setIsFetching(true);
    };
  }, [searchParams[0].get("q"), tab]);

  return {
    isFetching,
    tab,
    setTab,
    getResult,
    result,
  };
}

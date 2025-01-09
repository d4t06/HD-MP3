import { ElementRef, useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { nanoid } from "nanoid";

export default function useSearch() {
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const [searchResult, SetSearchResult] = useState<Song[]>([]);

  const inputRef = useRef<ElementRef<"input">>(null);

  const q = useDebounce(value, 700);

  const handleClickOutside = (e: Event) => {
    if (inputRef.current && (e.target as Node).contains(inputRef.current)) return;

    setIsFocus(false);
  };

  useEffect(() => {
    if (!q.trim()) {
      setIsFetching(false);
      SetSearchResult([]);
      return;
    }
    const controller = new AbortController();

    const fetchApi = async () => {
      try {
        setIsFetching(true);

        const playlistCollectionRef = collection(db, "playlist");

        const querySearchSong = query(playlistCollectionRef, where("by", "==", "admin"));

        const songsSnap = await getDocs(querySearchSong);

        if (songsSnap.docs) {
          const songs = songsSnap.docs.map(
            (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) } as Song)
          );

          SetSearchResult(songs);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchApi();

    return () => {
      console.log("abort");
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (isFocus) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFocus]);

  return { isFetching, searchResult, value, setValue, isFocus, setIsFocus, inputRef };
}

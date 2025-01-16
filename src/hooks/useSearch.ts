import { ElementRef, useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase";
// import { nanoid } from "nanoid";
import { devSongs } from "@/constants/songs";
import { sleep } from "@/utils/appHelpers";
import { useSearchParams } from "react-router-dom";

export default function useSearch() {
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const [searchResult, SetSearchResult] = useState<Song[]>([]);

  const formRef = useRef<ElementRef<"form">>(null); // for handle click outside
  const searchResultRef = useRef<ElementRef<"div">>(null); // for handle click outside
  const inputRef = useRef<ElementRef<"input">>(null); // for focus input

  const shouldFetchSong = useRef(true);

  const params = useSearchParams();
  const searchKey = useDebounce(value, 700);

  const controller = new AbortController();

  const handleClickOutside = (e: Event) => {
    const popupContent = document.querySelector(".popup-content");

    const node = e.target as Node;

    if (
      formRef.current &&
      searchResultRef.current &&
      (formRef.current.contains(node) ||
        searchResultRef.current.contains(node) ||
        popupContent?.contains(node))
    )
      return;

    setIsFocus(false);
  };

  // do search
  useEffect(() => {
    if (!searchKey.trim()) {
      setIsFetching(false);
      SetSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      try {
        setIsFetching(true);

        await sleep(1000);
        SetSearchResult(devSongs);

        // const songLstCollectionRef = collection(db, "playlist");

        // const querySearchSong = query(songLstCollectionRef, where("by", "==", "admin"));

        // const songsSnap = await getDocs(querySearchSong);

        // if (songsSnap.docs) {
        //   const songs = songsSnap.docs.map(
        //     (doc) => ({ ...doc.data(), song_in: "", queue_id: nanoid(4) }) as Song,
        //   );

        //   SetSearchResult(songs);
        // }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    if (shouldFetchSong.current) fetchApi();
    else shouldFetchSong.current = true;

    return () => {
      console.log("abort");
      controller.abort();
    };
  }, [searchKey]);

  // handle click outside
  useEffect(() => {
    if (isFocus) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFocus]);

  // update current state with url params
  useEffect(() => {
    setValue(params[0].get("q") || "");

    return () => {
      shouldFetchSong.current = false;

      inputRef.current?.blur();
      setIsFocus(false);
    };
  }, [params[0].get("q")]);

  // Allow to call seach api when value change
  useEffect(() => {
    if (params[0].get("q") !== value) if (isFocus) shouldFetchSong.current = true;
  }, [value, isFocus]);

  return {
    isFetching,
    searchResult,
    value,
    setValue,
    isFocus,
    setIsFocus,
    formRef,
    searchResultRef,
    inputRef,
  };
}

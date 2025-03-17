import { ElementRef, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks";
import { query, where } from "firebase/firestore";
import { songsCollectionRef } from "@/services/firebaseService";
import { implementSongQuery } from "@/services/appService";

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

    const modalContents = document.querySelectorAll(".modal-content");

    let isClickedSongItem = false;

    modalContents.forEach((modalContent) =>
      modalContent.contains(node) ? (isClickedSongItem = true) : {},
    );

    if (
      formRef.current &&
      searchResultRef.current &&
      (formRef.current.contains(node) ||
        isClickedSongItem ||
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

        const searchQuery = query(
          songsCollectionRef,
          where("is_official", "==", true),
          where("name", ">=", value),
          where("name", "<=", value + "\uf8ff"),
        );

        const result = await implementSongQuery(searchQuery);

        SetSearchResult(result);
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

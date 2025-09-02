import { ElementRef, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getSearchQuery, songsCollectionRef } from "@/services/firebaseService";
import { implementSongQuery } from "@/services/appService";
import { db } from "@/firebase";
import { getLocalStorage } from "@/utils/appHelpers";
import { useSearchContext } from "../SearchContext";
import { usePageContext } from "@/stores";

type SongItem = {
  variant: "song";
  item: Song;
};

type PlaylistItem = {
  variant: "playlist";
  item: Playlist;
};

type SingerItem = {
  variant: "singer";
  item: Singer;
};

export type RecentSearch = SongItem | PlaylistItem | SingerItem;

export default function useSearch() {
  const { playlistKeyPress } = usePageContext();
  const { isFocus, setIsFocus } = useSearchContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const [searchResult, SetSearchResult] = useState<Song[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);

  const [recentSearchs, setRecentSearchs] = useState<RecentSearch[]>([]);

  const formRef = useRef<ElementRef<"form">>(null); // for handle click outside
  const searchResultRef = useRef<ElementRef<"div">>(null); // for handle click outside
  const inputRef = useRef<ElementRef<"input">>(null); // for focus input

  const shouldFetchSong = useRef(true);
  const shouldFetchTrendingKeywords = useRef(true);

  const params = useSearchParams();
  const searchKey = useDebounce(value, 700);

  const controller = new AbortController();

  const handleFocus = () => {
    playlistKeyPress.current = false;
    setIsFocus(true);
  };

  const handleClickOutside = (e: Event) => {
    const searchResultEle = document.querySelector(".search-result");
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
        searchResultEle?.contains(node) ||
        popupContent?.contains(node))
    )
      return;

    setIsFocus(false);
    playlistKeyPress.current = true;
  };

  const getTrendingKeyword = async () => {
    try {
      const q = query(
        collection(db, "Trending_Keywords"),
        orderBy("today_count", "desc"),
        limit(5),
      );

      if (import.meta.env.DEV) console.log("useSearch, Get trendingKeywords");
      const snap = await getDocs(q);

      if (snap.empty) return;

      const keyWords = snap.docs.map((doc) => doc.id);

      setTrendingKeywords(keyWords);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    if (shouldFetchTrendingKeywords.current) {
      shouldFetchTrendingKeywords.current = false;
      getTrendingKeyword();
    }
  }, []);

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

        const q = getSearchQuery(
          songsCollectionRef,
          [where("is_official", "==", true)],
          value,
        );

        const result = await implementSongQuery(q);

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
    if (params[0].get("q") !== value)
      if (isFocus) shouldFetchSong.current = true;
  }, [value, isFocus]);

  useEffect(() => {
    setRecentSearchs(
      getLocalStorage()["recent-search"] || ([] as RecentSearch[]),
    );
  }, [isFocus]);

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
    recentSearchs,
    setRecentSearchs,
    trendingKeywords,
    handleFocus,
  };
}

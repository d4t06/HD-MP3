import { FormEvent, useEffect, useRef, useState } from "react";
import { useToastContext } from "@/stores";
import useInterceptRequest from "./useInterceptRequest";

type Track = {
  name: string;
  album: {
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    release_date: string;
  };
  artists: {
    name: string;
  }[];
};

export default function useSpotifySearch() {
  const { setErrorToast } = useToastContext();

  const [items, setItems] = useState<Track[]>([]);
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const formRef = useRef<HTMLFormElement>(null); // for handle click outside

  const interceptRequest = useInterceptRequest();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!value.trim() || isFetching) return;

      setIsFetching(true);

      const res = await interceptRequest.get<{ tracks: { items: Track[] } }>(
        `https://api.spotify.com/v1/search?q=${value}&limit=3&type=track`,
      );

      if (res.data?.tracks?.items) {
        console.log(res.data.tracks.items);
        setItems(res.data.tracks.items);
        setShowResult(true);
      }
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleClickOutside = (e: Event) => {
    const searchResultEle = document.querySelector(".search-result");

    const node = e.target as Node;

    if (
      !formRef.current ||
      searchResultEle?.contains(node) ||
      formRef.current.contains(node)
    )
      return;

    setIsFocus(false);
  };

  // handle click outside
  useEffect(() => {
    if (isFocus) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFocus]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    items,
    showResult,
    isFocus,
    setIsFocus,
    handleClickOutside,
    formRef,
    setShowResult,
  };
}

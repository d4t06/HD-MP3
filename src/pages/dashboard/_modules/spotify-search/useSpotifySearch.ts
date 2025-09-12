import { FormEvent, useEffect, useRef, useState } from "react";
import { useToastContext } from "@/stores";
import useInterceptRequest from "./useInterceptRequest";
import { isAxiosError } from "axios";

export type Track = {
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

export type Artist = {
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
};

const tabs = ["Track", "Artist"] as const;
type Tab = (typeof tabs)[number];

type SongResult = Record<(typeof tabs)[0], Track[]>;
type SingerResult = Record<(typeof tabs)[1], Artist[]>;

type ResultMap = SongResult & SingerResult;

export default function useSpotifySearch() {
  const { setErrorToast } = useToastContext();

  const [tab, setTab] = useState<Tab>("Track");
  const [resutMap, setResultMap] = useState<ResultMap>({
    Track: [],
    Artist: [],
  });
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const formRef = useRef<HTMLFormElement>(null); // for handle click outside
  const controllerRef = useRef<AbortController>();

  const interceptRequest = useInterceptRequest();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      if (!value.trim() || isFetching) return;

      setIsFetching(true);

      const res = await interceptRequest.get(
        `https://api.spotify.com/v1/search?q=${value}&limit=3&type=${tab.toLowerCase()}`,
        { signal: controllerRef.current.signal },
      );

      switch (tab) {
        case "Track":
          setResultMap((prev) => ({
            ...prev,
            [tab]: res.data?.tracks?.items,
          }));
          break;
        case "Artist":
          setResultMap((prev) => ({
            ...prev,
            [tab]: res.data?.artists?.items,
          }));
          break;
      }

      setShowResult(true);
    } catch (err: any) {
      if (isAxiosError(err)) {
        if (err.code === "ERR_CANCELED") {
          console.log("abort");
        } else {
          console.log({ message: err });
          setErrorToast();
        }
      } else {
        setErrorToast("Unexpected Error");
      }
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

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    resutMap,
    showResult,
    isFocus,
    setIsFocus,
    handleClickOutside,
    formRef,
    setShowResult,
    tabs,
    tab,
    setTab,
  };
}

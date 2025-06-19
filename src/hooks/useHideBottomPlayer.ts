import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function useHideBottomPlayer({ audioEle }: Props) {
  const location = useLocation();

  const shouldHide = useMemo(
    () => location.pathname.includes("lyric") || location.pathname === "/",
    [location],
  );

  useEffect(() => {
    if (shouldHide) {
      audioEle.pause();
    }
  }, [location]);

  return { shouldHide };
}

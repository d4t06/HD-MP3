import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function useHideMobileBottomPlayer({ audioEle }: Props) {
  const location = useLocation();

  const shouldHidePlayer = useMemo(() => location.pathname === "/", [location]);

  const shouldHideAll = useMemo(
    () => location.pathname.includes("lyric"),
    [location],
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    if (shouldHidePlayer || shouldHideAll) {
      audioEle.pause();
    }
  }, [location]);

  return { shouldHidePlayer, location, shouldHideAll };
}

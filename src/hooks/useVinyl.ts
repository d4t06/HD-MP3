import { RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";

type Props = {
  vinylRef: RefObject<HTMLDivElement>;
};

export default function useVinyl({ vinylRef }: Props) {
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  useEffect(() => {
    const vinylEle = vinylRef.current;
    if (!vinylEle) return;

    if (playStatus === "playing") vinylEle.style.animationPlayState = "running";
    else vinylEle.style.animationPlayState = "paused";
  }, [playStatus]);
}

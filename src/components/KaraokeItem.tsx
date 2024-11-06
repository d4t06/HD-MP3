import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  text: string;
  overlayRef: RefObject<ElementRef<"p">>;
};

export default function KaraokeItem({ text, overlayRef }: Props) {
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const [_text, _setText] = useState(text);
  const [isMounted, setIsMounted] = useState(false);

  const shouldFade = useRef(true);

  useEffect(() => {
    if (!text) return;
    setIsMounted(false);
   //  if (overlayRef.current) {
   //    overlayRef.current.style.animation = "none";
   //  }
  }, [text]);

  useEffect(() => {
    if (isMounted) return;

    const job = () => {
      _setText(text);
      setIsMounted(true);
    };

    if (shouldFade.current) {
      setTimeout(job, 300);
    } else {
      shouldFade.current = true;
      job();
    }
  }, [isMounted]);

  useEffect(() => {
    if (playStatus === "waiting") shouldFade.current = false;

    if (overlayRef.current) {
      if (playStatus === "playing") {
        overlayRef.current.style.animationPlayState = "running";
      } else overlayRef.current.style.animationPlayState = "paused";
    }
  }, [playStatus]);

  const classes = {
    lyric: "relative duration-300 text-[44px] font-[700] pointer-none",
  };

  return (
    <div
      className={`${classes.lyric} ${shouldFade.current ? "transition-opacity" : ""} ${
        isMounted ? "opacity-[1]" : "opacity-0"
      }`}
    >
      {_text || "..."}
      <p
        ref={overlayRef}
        className="absolute whitespace-nowrap w-0 overflow-hidden text-[#ffed00] left-0 top-0 h-full"
      >
        {_text || "..."}
      </p>
    </div>
  );
}

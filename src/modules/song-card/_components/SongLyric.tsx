import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useLyric from "../_hooks/useSongLyric";
import { usePlayerContext } from "./PlayerContext";
import { useEffect, useMemo, useRef } from "react";
import useGetLyric from "../_hooks/useGetLyric";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function SongLyric({ audioEle }: Props) {
  const { lyrics, canPlay } = usePlayerContext();
  const { isFetching } = useGetLyric();

  const mainLyricRef = useRef<HTMLParagraphElement | null>(null);
  const subLyricRef = useRef<HTMLParagraphElement | null>(null);

  const spaceFromTop = useRef(40);

  const { currentIndex } = useLyric({
    audioEle,
    lyrics,
    isActive: canPlay,
    bounded: 0,
  });

  const renderItem = useMemo(() => {
    if (lyrics[currentIndex])
      return (
        <>
          <p
            key={currentIndex + "1"}
            style={{
              transform: `translateY(calc(${spaceFromTop.current}px)`,
            }}
            className={`transition-transform origin-bottom-left duration-[.4s]`}
            ref={mainLyricRef}
          >
            {lyrics[currentIndex].text}
          </p>
          {lyrics[currentIndex + 1] && (
            <p
              key={currentIndex + "11"}
              ref={subLyricRef}
              className="mt-3 transition-[transform,opacity] duration-[.4s] opacity-0 translate-y-[-10px]"
            >
              {lyrics[currentIndex + 1].text}
            </p>
          )}
        </>
      );

    return <></>;
  }, [currentIndex, lyrics]);

  const classes = {
    container:
      "no-scrollbar leading-[1.2] [&_p]:w-[80%] [&_p]:select-none [&_p]:font-bold pt-3",
  };

  useEffect(() => {
    setTimeout(() => {
      if (mainLyricRef.current) {
        Object.assign(mainLyricRef.current.style, {
          transform: "scale(1.3) translateY(0px)",
        });

        spaceFromTop.current = +(
          mainLyricRef.current.offsetHeight * 1.3
        ).toFixed(1);
      }

      if (subLyricRef.current) {
        Object.assign(subLyricRef.current.style, {
          transform: "translateY(0px)",
          opacity: "1",
        });
      }
    }, 30);
  }, [currentIndex, lyrics]);

  return (
    <div className={`${classes.container}`}>
      {isFetching && (
        <div className="relative w-full h-full">
          <ArrowPathIcon className="w-7 animate-spin" />
        </div>
      )}

      {!isFetching && <>{lyrics.length ? renderItem : <div>...</div>}</>}
    </div>
  );
}

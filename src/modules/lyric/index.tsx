import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Center } from "@/components";
import useLyric from "./_hooks/useLyric";
import { LyricStatus } from "../lyric-editor";
import LyricItem from "./LyricItem";
import { usePlayerContext } from "@/stores";

interface Props {
  className: string;
  active: boolean;
}

export default function LyricsList({ className, active }: Props) {
  // state
  const {
    playerConig: { lyricSize },
  } = usePlayerContext();

  const { loading, songLyrics, currentIndex, containerRef, lyricRefs } = useLyric({
    active,
  });

  const lyricSizeMap = {
    small: "text-[16px] sm:text-[26px]",
    medium: "text-[20px] sm:text-[30px]",
    large: "text-[26px] sm:text-[46px]",
  };

  const renderItem = () => {
    return songLyrics.map((l, index) => {
      let status: LyricStatus = "coming";

      if (currentIndex === index) status = "active";
      else if (index < currentIndex) status = "done";

      return (
        <LyricItem
          ref={(el) => (lyricRefs.current[index] = el!)}
          status={status}
          key={index}
          text={l.text}
          activeColor="scale-[1.3]"
          className={`leading-[1.3] mb-3 w-[70%] md:mb-5 last:mb-[50vh]`}
        />
      );
    });
  };

  const classes = {
    container: "no-scrollbar pt-[20px] mask-image overflow-y-auto overflow-x-hidden",
  };

  return (
    <div
      ref={containerRef}
      className={`${classes.container} ${
        lyricSizeMap[lyricSize || "medium"]
      } ${className}`}
    >
      {loading && (
        <div className="relative w-full h-full">
          <Center>
            <ArrowPathIcon className="w-7 animate-spin" />
          </Center>
        </div>
      )}

      {!loading && (
        <>
          {songLyrics.length ? (
            renderItem()
          ) : (
            <div className="relative w-full h-full">
              <Center>
                <h1 className="text-[30px] opacity-60">...</h1>
              </Center>
            </div>
          )}
        </>
      )}
    </div>
  );
}

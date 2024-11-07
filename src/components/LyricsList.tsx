import { FC } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { LyricStatus } from "./LyricEditor";
import useLyricList from "@/hooks/useLyricList";
import { Center } from "./ui/Center";

interface Props {
  audioEle: HTMLAudioElement;
  className: string;
  active: boolean;
}

const LyricsList: FC<Props> = ({ audioEle, className, active }) => {
  // state
  const { lyricSize } = useSelector(selectAllPlayStatusStore);

  const { loading, songLyrics, currentIndex, containerRef, lyricRefs, scrollBehavior } =
    useLyricList({ active, audioEle });

  const lyricSizeMap = {
    small: "text-[20px] sm:text-[30px]",
    medium: "text-[25px] sm:text-[35px]",
    large: "text-[30px] sm:text-[40px]",
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
          scrollBehavior={scrollBehavior}
          className={`font-[700] ${
            lyricSizeMap[lyricSize || "medium"]
          } mb-[30px] last:mb-[50vh]`}
        />
      );
    });
  };

  const classes = {
    container: "no-scrollbar pt-[20px] mask-image overflow-y-auto overflow-x-hidden",
  };

  return (
    <div ref={containerRef} className={`${classes.container} ${className}`}>
      {loading && (
        <Center>
          <ArrowPathIcon className="w-7 animate-spin" />
        </Center>
      )}

      {!loading && (
        <>
          {songLyrics.length ? (
            renderItem()
          ) : (
            <Center>
              <h1 className="text-[30px] opacity-60">...</h1>
            </Center>
          )}
        </>
      )}
    </div>
  );
};

export default LyricsList;

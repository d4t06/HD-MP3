import { FC } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { LyricStatus } from "./LyricEditor";
import useLyricList from "@/hooks/useLyricList";
import { Center } from "./ui/Center";

interface Props {
  className: string;
  active: boolean;
}

const LyricsList: FC<Props> = ({ className, active }) => {
  // state
  const { lyricSize } = useSelector(selectAllPlayStatusStore);

  const { loading, songLyrics, currentIndex, containerRef, lyricRefs } = useLyricList({
    active,
  });

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
          className={` mb-[30px] last:mb-[50vh]`}
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
};

export default LyricsList;

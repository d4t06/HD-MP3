import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";
import { usePlayerContext } from "@/stores";
import FullScreenPlayerHeader from "./_components/FullScreenPlayerHeader";
import FullScreenPlayerContent from "./_components/FullScreenPlayerContent";

export default function FullScreenPlayer() {
  // use stores
  const {
    isOpenFullScreen,
    idle,
    activeTab,
    playerConfig: { songBackground },
  } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);

  const classes = {
    wrapper: `fixed inset-0 z-50 overflow-hidden text-white bg-zinc-900 transition-transform duration-[.7s] linear delay-100`,
    bg: `absolute inset-0 -z-10 brightness-[10%]`,
    container: "absolute w-full top-0 bottom-[90px] flex flex-col",
    content: `flex-grow relative overflow-hidden`,
    fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
  };

  return (
    <div
      className={`${classes.wrapper}  ${
        isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* bg image */}
      {songBackground && (
        <div className="absolute left-0 right-0 aspect-[1/1] brightness-[80%] -translate-y-1/2 top-1/2">
          <Blurhash
            radioGroup=""
            height={"100%"}
            width={"100%"}
            hash={currentSongData?.song?.blurhash_encode || defaultBlurhash}
          />
        </div>
      )}

      <div className={classes.container}>
        <FullScreenPlayerHeader />

        {/* content */}
        <div className={classes.content}>
          <FullScreenPlayerContent />
        </div>

        {activeTab !== "Songs" && (
          <p className={`text-center ${idle && classes.fadeTransition}`}>
            {currentSongData?.song?.name || "..."}
            <span className="opacity-70 text-sm">
              {" - "}
              {currentSongData?.song.singers.map(
                (s, i) => (i ? ", " : "") + s.name,
              )}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

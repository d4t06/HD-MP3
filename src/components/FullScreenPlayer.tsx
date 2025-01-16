import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { usePlayerContext } from "@/store";
import FullScreenPlayerHeader from "./FullScreenPlayerHeader";
import FullScreenPlayerSongList from "./FullScreenPlayerSongList";

export default function FullScreenPlayer() {
  // use store
  const { isOpenFullScreen, idle, activeTab } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);
  const { songBackground } = useSelector(selectAllPlayStatusStore);

  const classes = {
    wrapper: `fixed inset-0 z-50 overflow-hidden text-white bg-zinc-900
    } transition-transform duration-[.7s] linear delay-100`,
    bg: `absolute inset-0 -z-10 brightness-[70%]`,
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
      <div className={` ${classes.bg}`}>
        {songBackground && (
          <Blurhash
            radioGroup=""
            height={"100%"}
            width={"100%"}
            hash={currentSongData?.song?.blurhash_encode || defaultBlurhash}
          />
        )}
      </div>

      <div className={classes.container}>
        <FullScreenPlayerHeader />

        {/* content */}
        <div className={classes.content}>
          <FullScreenPlayerSongList />
        </div>

        {activeTab !== "Songs" && (
          <p className={`text-center ${idle && classes.fadeTransition}`}>
            {currentSongData?.song?.name || "..."}
            <span className="opacity-70">
              &nbsp;- {currentSongData?.song?.singer || "..."}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

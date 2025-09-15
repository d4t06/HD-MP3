import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import {
  FullScreenPlayerSetting,
  GetSongLyric,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
} from "@/components";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import LyricContextProvider from "@/stores/LyricContext";
import { usePlayerContext } from "@/stores";
import SongThumbnail from "./_components/SongThumbnail";
import Lyric from "../lyric";
import ScrollText from "../scroll-text";
import { Link } from "react-router-dom";
import MobileFullScreenControl from "./_components/Control";

export default function MobileFullScreenPlayer() {
  // use stores
  const {
    isOpenFullScreen,
    playerConfig: { songBackground },
    mobileActiveTab,
  } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);

  const classes = {
    headerWrapper: "flex mb-4",
    container: "flex-grow flex flex-col relative overflow-hidden",
    control: "mt-auto",
    // when set to absolute, the container move a little when lyric scroll on iphone
    bgImage:
      "fixed left-0 right-0 top-1/2 pt-[100%] -z-10 brightness-[90%] origin-top pointer-events-none",
  };

  return (
    <>
      <div className={`full-screen-player`}>
        {songBackground && (
          <div style={{transform: 'translate3d(0, -50%, 0)', scale: '2.5'}} className={classes.bgImage}>
            <div className="absolute inset-0">
              <Blurhash
                width={"100%"}
                height={"100%"}
                hash={currentSongData?.song.blurhash_encode || defaultBlurhash}
              />
            </div>
          </div>
        )}

        <div className="h-full z-10 p-4 flex flex-col w-full">
          {/* container */}
          <div className={classes.container}>
            {/* >>> song image */}
            <div
              className={`${mobileActiveTab != "Playing" ? "flex items-center" : "sm:flex"}`}
            >
              <SongThumbnail imageUrl={currentSongData?.song.image_url} />

              <div
                className={`ml-2 font-bold h-full ${mobileActiveTab != "Playing" ? "block" : "hidden sm:block"}`}
              >
                <p className="line-clamp-1 text-lg">
                  {currentSongData?.song.name}
                </p>
                <p className={`opacity-80 text-sm line-clamp-1`}>
                  {currentSongData?.song.singers.map((s, i) => (
                    <span key={i}> {(i ? ", " : "") + s.name}</span>
                  ))}
                </p>
              </div>

              {mobileActiveTab === "Lyric" && (
                <MyPopup appendOnPortal>
                  <MyPopupTrigger>
                    <button
                      className={` p-[6px] rounded-full ml-auto  bg-white/10`}
                    >
                      <Cog6ToothIcon className="w-6" />
                    </button>
                  </MyPopupTrigger>

                  <MyPopupContent position="left-bottom" origin="top right">
                    <FullScreenPlayerSetting />
                  </MyPopupContent>
                </MyPopup>
              )}
            </div>

            {/* <<< end song image */}

            {/* >>> song name */}
            <div
              className={`mt-4 justify-between items-center ${
                mobileActiveTab != "Playing" ? "hidden" : "flex sm:hidden"
              }`}
            >
              <div className="flex-grow font-bold">
                <div className={"h-7"}>
                  <ScrollText
                    className={`text-xl`}
                    content={currentSongData?.song.name || "..."}
                  />
                </div>
                <div className={`opacity-80 line-clamp-1`}>
                  {currentSongData?.song.singers.map((s, i) =>
                    s.id ? (
                      <Link to={`/singer/${s.id}`} key={i}>
                        {(i ? ", " : "") + s.name}
                      </Link>
                    ) : (
                      <span key={i}> {(i ? ", " : "") + s.name}</span>
                    ),
                  )}
                </div>
              </div>
            </div>
            {/* <<< end song name */}

            <LyricContextProvider>
              {/* >>> lyric tab */}
              <GetSongLyric
                isOpenLyricTabs={isOpenFullScreen && mobileActiveTab == "Lyric"}
              >
                <Lyric
                  className={`text-center ${
                    mobileActiveTab === "Lyric" ? "flex-1 block" : "hidden"
                  }`}
                />
              </GetSongLyric>
            </LyricContextProvider>

            {/* control */}
            <div className={`${classes.control}`}>
              <MobileFullScreenControl />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

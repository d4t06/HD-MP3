import { useRef } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { FullScreenPlayerSetting } from "@/components";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "@/components/MyPopup";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import LyricContextProvider from "@/stores/LyricContext";
import { usePlayerContext } from "@/stores";
import useMobileFullScreenPlayer from "./_hooks/useMobileFullScreenPlayer";
import SongThumbnail from "./_components/SongThumbnail";
import LyricsList from "../lyric";
import ScrollText from "../scroll-text";
import { Link } from "react-router-dom";
import MobileFullScreenControl from "./_components/Control";

export default function MobileFullScreenPlayer() {
  // use stores
  const {
    isOpenFullScreen,
    playerConig: { songBackground },
    mobileActiveTab,
  } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);

  // ref
  const containerRef = useRef<HTMLDivElement>(null);

  // use hooks
  const { wrapperRef } = useMobileFullScreenPlayer({ isOpenFullScreen });

  const classes = {
    headerWrapper: "flex mb-4",
    container: "flex-grow flex flex-col relative overflow-hidden",
    control: "mt-auto",

    bgImage: "absolute inset-0 z-[-9] brightness-[70%] blur-[4px] translate-3d-0",
  };


  console.log('render')

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ transform: "translate(0, 100%)", zIndex: "-10" }}
        className={`block md:hidden fixed inset-0 bg-zinc-900 text-white overflow-hidden transition-[transform] duration-[.3s] ease-linear`}
      >
        {songBackground && (
          <div className={classes.bgImage}>
            <Blurhash
              width={"100%"}
              height={"100%"}
              hash={currentSongData?.song.blurhash_encode || defaultBlurhash}
            />
          </div>
        )}

        <div className="h-full z-10 p-4 flex flex-col">
          {/* container */}
          <div ref={containerRef} className={classes.container}>
            {/* >>> song image */}
            <div
              className={`${mobileActiveTab != "Playing" ? "flex items-center" : "sm:flex"}`}
            >
              <SongThumbnail imageUrl={currentSongData?.song.image_url} />

              <div
                className={`ml-2 ${mobileActiveTab != "Playing" ? "block" : "hidden sm:block"}`}
              >
                <p className="font-playwriteCU translate-y-[-6px] leading-[2.4] line-clamp-1">
                  {currentSongData?.song.name}
                </p>
                <div className={`opacity-[.7] line-clamp-1 text-sm`}>
                  {currentSongData?.song.singers.map((s, i) => (
                    <span key={i}> {(i ? ", " : "") + s.name}</span>
                  ))}
                </div>
              </div>

              {mobileActiveTab === "Lyric" && (
                <MyPopup appendOnPortal>
                  <MyPopupTrigger>
                    <button className={` p-[6px] rounded-full ml-auto  bg-white/10`}>
                      <Cog6ToothIcon className="w-6" />
                    </button>
                  </MyPopupTrigger>

                  <MyPopupContent
                    appendTo="portal"
                    position="left-bottom"
                    origin="top right"
                  >
                    <FullScreenPlayerSetting />
                  </MyPopupContent>
                </MyPopup>
              )}
            </div>

            {/* <<< end song image */}

            {/* >>> song name */}
            <div
              className={`mt-2 justify-between items-center ${
                mobileActiveTab != "Playing" ? "hidden" : "flex sm:hidden"
              }`}
            >
              <div className="flex-grow">
                <div className={"h-[40px]"}>
                  <ScrollText
                    className={`text-xl leading-[1.5] font-playwriteCU`}
                    content={currentSongData?.song.name || "..."}
                  />
                </div>
                <div className={`opacity-[.7] line-clamp-1 text-sm`}>
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
              <LyricsList
                active={isOpenFullScreen && mobileActiveTab === "Lyric"}
                className={`text-left ${
                  mobileActiveTab === "Lyric" ? "flex-1 block" : "hidden"
                }`}
              />
              {/* <<< end lyric tab */}
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

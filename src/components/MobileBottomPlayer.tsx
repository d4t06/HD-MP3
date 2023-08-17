import {
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
import {
  ArrowPathIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { songs } from "../utils/songs";

interface Props {
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  isOpenFullScreen: boolean;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isPlaying: boolean;
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}

const MobileBottomPlayer: FC<Props> = ({
  isOpenFullScreen,
  setIsOpenFullScreen,
  idle,
  audioEle,

  isPlaying,
  setIsPlaying,
}) => {
  const SongStore = useSelector(selectAllSongStore);
  const dispatch = useDispatch();

  const { song: songInStore } = SongStore;

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const play = () => {
    audioEle?.play();
  };
  const pause = () => {
    audioEle?.pause();
  };

  const getNewSong = (index: number) => {
    return songs[index];
  };

  // >>> click handle
  const handlePlayPause = () => {
    isPlaying ? pause() : play();
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    let newIndex = songInStore.currentIndex! + 1;
    let newSong;
    if (newIndex < songs.length) {
      newSong = songs[newIndex];
    } else {
      newSong = songs[0];
      newIndex = 0;
    }
    dispatch(setSong({ ...newSong, currentIndex: newIndex }));
  };

  return (
    <div
      className={`fixed bottom-0 w-full h-[90px] border-t z-50 text-white px-[20px] 
            ${isOpenFullScreen ? "hidden" : ""} `}
    >
      <div className={`flex flex-row  h-full`}>
        <div
          onClick={() => setIsOpenFullScreen(true)}
          className={`mobile-current-song flex-grow`}
        >
          <div className={`left flex flex-row items-center h-full`}>
            <div className="w-[40px] h-[40px]">
              <img
                className={`w-full object-cover object-center rounded-full`}
                src={
                  songInStore.image
                    ? songInStore.image
                    : "https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                }
              />
            </div>

            <div className="right text-gray-100 ml-[10px]">
              {songInStore.path && (
                <>
                  <h5 className="text-xl mb overflow-hidden leading-[1]">
                    {songInStore?.name || "name"}
                  </h5>
                  <p className="text-md text-gray-400 leading-[1] mt-[5px]">
                    {songInStore?.singer || "singer"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mobile-bottom-player flex items-center h-full pl-[15px] gap-[10px]`}
        >
          <button className="w-10" onClick={() => handlePlayPause()}>
            {isWaiting ? (
              <ArrowPathIcon className={"animate-spin"} />
            ) : isPlaying ? (
              <PauseCircleIcon />
            ) : (
              <PlayCircleIcon />
            )}
          </button>
          <button className="w-10">
            <ForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomPlayer;

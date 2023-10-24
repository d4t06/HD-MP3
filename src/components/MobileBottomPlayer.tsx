import { Dispatch, FC, SetStateAction } from "react";
import {
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import zingIcon from "../assets/icon-zing.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useSongsStore } from "../store/SongsContext";

interface Props {
  audioEle: HTMLAudioElement;
  idle: boolean;
  isOpenFullScreen: boolean;
  isPlaying: boolean;
  isWaiting: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
}

const MobileBottomPlayer: FC<Props> = ({
  audioEle,
  isWaiting,
  setIsOpenFullScreen,
  isOpenFullScreen,
  // idle,

  isPlaying,
}) => {
  const dispatch = useDispatch();
  const SongStore = useSelector(selectAllSongStore);

  const { userSongs } = useSongsStore();
  const { theme } = useTheme();
  const { song: songInStore } = SongStore;

  const play = () => {
    audioEle?.play();
  };
  const pause = () => {
    audioEle?.pause();
  };

  const handlePlayPause = () => {
    isPlaying ? pause() : play();
  };

  const handleNext = () => {
    let newIndex = songInStore.currentIndex! + 1;
    let newSong;
    if (newIndex < userSongs.length) {
      newSong = userSongs[newIndex];
    } else {
      newSong = userSongs[0];
      newIndex = 0;
    }
    dispatch(setSong({ ...newSong, currentIndex: newIndex, song_in: songInStore.song_in }));
  };

  const textColor = theme.type === "light" ? "text-[#333]" : "text-[#fff]";

  return (
    <div
      className={`fixed bottom-0 w-full h-[70px] border-t border-${theme.alpha} z-40  px-[20px] `}
    >
      <div
        className={`absolute inset-0 ${
          theme.bottom_player_bg
        } bg-opacity-[0.7] backdrop-blur-[15px] z-[-1] ${isOpenFullScreen ? "opacity-0" : ""}`}
      ></div>

      <div className={`flex flex-row  h-full`}>
        <div onClick={() => setIsOpenFullScreen(true)} className={`mobile-current-song flex-grow`}>
          {/* song image, name and singer */}
          <div className={` flex flex-row items-center flex-grow h-full`}>
            <div className="w-[40px] h-[40px]">
              <img
                className={`w-full object-cover object-center rounded-full`}
                src={songInStore.image_url ? songInStore.image_url : zingIcon}
              />
            </div>

            <div className="flex-grow  ml-[10px]">
              {songInStore.song_url && (
                <>
                  <h5 className="text-[18px] font-[500] line-clamp-1">
                    {songInStore?.name || "name"}
                  </h5>
                  <p className={`text-[14px] font-[400] line-clamp-1`}>
                    {songInStore?.singer || "singer"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mobile-bottom-player flex items-center h-full pl-[15px] gap-[10px] ${
            !songInStore.name && "opacity-60 pointer-events-none"
          }`}
        >
          <button className={`${textColor} p-[4px]`} onClick={() => handlePlayPause()}>
            {isWaiting ? (
              <TruckIcon className={"w-[35px]"} />
            ) : isPlaying ? (
              <PauseCircleIcon className="w-[35px]" />
            ) : (
              <PlayCircleIcon className="w-[35px]" />
            )}
          </button>
          <button onClick={handleNext} className={`${textColor} p-[4px]`}>
            <ForwardIcon className="w-[35px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomPlayer;

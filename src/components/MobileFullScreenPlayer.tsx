import {
  FC,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import handleTimeText from "../utils/handleTimeText";
import useLocalStorage from "../hooks/useLocalStorage";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { songs } from "../utils/songs";

import SongThumbnail from "./ui/SongThumbnail";
import Tabs from "./ui/Tabs";
import Button from "./ui/Button";
import PlayerControl from "./ui/PlayerControl";

type Props = {
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
};

const MobileFullScreenPlayer: FC<Props> = ({
  isOpenFullScreen,
  setIsOpenFullScreen,
  idle,
  audioEle,
  isPlaying,
  setIsPlaying,
}) => {
  const songStore = useSelector(selectAllSongStore);
  const dispatch = useDispatch();
  const { song: songInStore } = songStore;

  const [activeTab, setActiveTab] = useState<string>("Lyric");
  const [duration, setDuration] = useState<number>();

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isMute, setIsMute] = useState(false);

  const [isRepeat, setIsRepeat] = useLocalStorage<boolean>("repeat", false);
  const [isShuffle, setIsShuffle] = useLocalStorage<boolean>("shuffle", false);

  const durationLineWidth = useRef<number>();
  const durationLine = useRef<HTMLDivElement>(null);
  const timeProcessLine = useRef<HTMLDivElement>(null);

  const volumeLineWidth = useRef<number>();
  const volumeLine = useRef<HTMLDivElement>(null);
  const volumeProcessLine = useRef<HTMLDivElement>(null);

  const currentTimeRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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

  const handleResetForNewSong = () => {
    const timeProcessLineElement = timeProcessLine.current as HTMLElement;

    if (timeProcessLineElement && currentTimeRef.current) {
      currentTimeRef.current.innerText = "00:00";
      timeProcessLineElement.style.width = "0%";
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const node = e.target as HTMLElement;

    if (durationLineWidth.current && duration) {
      // get boundingRect
      const clientRect = node.getBoundingClientRect();
      // get elements
      const timeProcessLineElement = timeProcessLine.current as HTMLElement;

      // calculating
      const length = e.clientX - clientRect.left;
      const lengthRatio = length / durationLineWidth.current;
      const newTime = lengthRatio * duration;

      if (audioEle && timeProcessLineElement) {
        // update current time
        audioEle.currentTime = +newTime.toFixed(1);
        // update process line width
        timeProcessLineElement.style.width =
          (lengthRatio * 100).toFixed(1) + "%";

        if (!isPlaying) play();
      }
    }
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

  const handlePrevious = () => {
    let newIndex = songInStore.currentIndex! - 1;
    let newSong;
    if (newIndex >= 0) {
      newSong = songs[newIndex];
    } else {
      newSong = songs[songs.length - 1];
      newIndex = songs.length - 1;
    }

    dispatch(setSong({ ...newSong, currentIndex: newIndex }));
  };

  const handleSetVolume = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const node = e.target as HTMLElement;
    const clientRect = node.getBoundingClientRect();

    if (volumeLineWidth.current) {
      let newVolume = (e.clientX - clientRect.x) / volumeLineWidth.current;

      if (newVolume > 0.9) newVolume = 1;
      if (newVolume < 0.1) newVolume = 0;

      if (volumeProcessLine.current && audioEle) {
        volumeProcessLine.current.style.width = newVolume * 100 + "%";
        audioEle.volume = newVolume;
      }
    }
  };

  const handleMute = () => {
    if (audioEle.muted) {
      audioEle.muted = false;
      setIsMute(false);
    } else {
      audioEle.muted = true;
      setIsMute(true);
    }
  };

  // >>> behind the scenes handle
  const handlePlaying = () => {
    setIsPlaying(true);
    setIsWaiting(false);

    const currentTime = audioEle?.currentTime;
    const duration = audioEle?.duration;

    const timeProcessLineEle = timeProcessLine.current as HTMLElement;

    if (duration && currentTime) {
      const newWidth = currentTime / (duration / 100);

      timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
    }

    if (currentTimeRef.current) {
      currentTimeRef.current.innerText = handleTimeText(currentTime!);
    }
  };

  const handleWaiting = () => {
    setIsWaiting(true);
  };

  const handleEnded = () => {
    if (isRepeat) {
      console.log("song repeat");

      return play();
    }
    if (isShuffle) {
      let randomIndex: number = songInStore.currentIndex!;
      while (randomIndex === songInStore.currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }

      const newSong = getNewSong(randomIndex);
      return dispatch(
        setSong({
          ...newSong,
          currentIndex: randomIndex,
        })
      );
    }

    return handleNext();
  };

  const handleLoaded = () => {
    // get element
    // const audioElement = audioEle;

    // set duration
    setDuration(audioEle?.duration);

    // set duration base line width
    durationLineWidth.current = durationLine.current?.offsetWidth;
    volumeLineWidth.current = volumeLine.current?.offsetWidth;

    // add event listener
    audioEle?.addEventListener("pause", handlePause);
    audioEle?.addEventListener("timeupdate", handlePlaying);
    audioEle?.addEventListener("ended", handleEnded);
    audioEle?.addEventListener("waiting", handleWaiting);

    // play song if click it
    play();
  };

  useEffect(() => {}, [songInStore]);

  // run when current song change
  useEffect(() => {
    if (!audioEle) return;

    if (songInStore.image) {
      const node = bgRef.current as HTMLElement;
      node.style.backgroundImage = `url(${songInStore.image})`;
    }
    const audioElement = audioEle;

    audioElement.onloadedmetadata = () => {
      handleLoaded();
    };

    return () => {
      audioEle?.removeEventListener("timeupdate", handlePlaying);
      audioEle?.removeEventListener("pause", handlePause);
      audioEle?.removeEventListener("ended", handleEnded);
      audioEle?.removeEventListener("waiting", handleWaiting);

      handleResetForNewSong();
    };
  }, [songInStore]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-zinc-900 text-white overflow-hidden  ${
        isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      } transition-[transform] duration-300 ease-in-out delay-150  `}
    >
      <div
        ref={bgRef}
        className={`absolute h-[100vh] w-[100vw] -z-10 inset-0 bg-no-repeat bg-cover bg-center blur-[99px] transition-[background] duration-100`}
      ></div>
      <div
        className={`absolute h-[100vh] w-[100vw] inset-0 bg-zinc-900 bg-opacity-80 bg-blend-multiply`}
      ></div>

      <div className="relative h-full px-[15px]">
        <div className="header flex justify-center pt-[15px] ">
          <Tabs
            idle={idle}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={["Songs", "Playing", "Lyric"]}
          />

          <Button
            className="absolute right-[15px]"
            variant={"circle"}
            size={"normal"}
            onClick={() => setIsOpenFullScreen(false)}
          >
            <ChevronDownIcon />
          </Button>
        </div>

        <div className="mt-[15px]">
          <SongThumbnail hasTitle active={isPlaying} data={songInStore} />
        </div>

        <div className="mt-[15px]">
          <PlayerControl
            audioEle={audioEle}
            isWaiting={isWaiting}
            isPlaying={isPlaying}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
            currentTimeRef={currentTimeRef}
            timeProcessLine={timeProcessLine}
            durationLine={durationLine}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handlePlayPause={handlePlayPause}
            handleSeek={handleSeek}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFullScreenPlayer;

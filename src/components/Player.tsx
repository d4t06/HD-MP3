import { FC, useRef, useState } from "react";

import BottomPlayer from "./BottomPlayer";
import FullScreenPlayer from "./FullScreenPlayer";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import MobileFullScreenPlayer from "./MobileFullScreenPlayer";
import MobileBottomPlayer from "./MobileBottomPlayer";

interface Props {}

const Player: FC<Props> = () => {
  const songStore = useSelector(selectAllSongStore);

  const { song: songInStore } = songStore;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);

  const Player = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const windowWidth = useRef<number>(window.innerWidth);

  console.log("check windowWidth", windowWidth);

  const desktopContent = (
    <>
      <FullScreenPlayer
        idle={false}
        isPlaying={isPlaying}
        isOpenFullScreen={isOpenFullScreen}
        audioEle={audioRef.current as HTMLAudioElement}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />

      <BottomPlayer
        idle={false && isOpenFullScreen}
        isPlaying={isPlaying}
        isOpenFullScreen={isOpenFullScreen}
        audioEle={audioRef.current as HTMLAudioElement}
        setIsPlaying={setIsPlaying}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />
    </>
  );

  const mobileContent = (
    <>
      <MobileFullScreenPlayer
        idle={false}
        isPlaying={isPlaying}
        isOpenFullScreen={isOpenFullScreen}
        audioEle={audioRef.current as HTMLAudioElement}
        setIsOpenFullScreen={setIsOpenFullScreen}
        setIsPlaying={setIsPlaying}
      />

      <MobileBottomPlayer
        idle={false && isOpenFullScreen}
        isPlaying={isPlaying}
        isOpenFullScreen={isOpenFullScreen}
        audioEle={audioRef.current as HTMLAudioElement}
        setIsPlaying={setIsPlaying}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />
    </>
  );

  return (
    <div ref={Player} className="fixed">
      <audio ref={audioRef} src={songInStore.path} className="hidden"></audio>

      {windowWidth.current >= 550 ? desktopContent : mobileContent}
    </div>
  );
};

export default Player;

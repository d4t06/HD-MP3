import { FC, useRef, useState } from "react";

import BottomPlayer from "./BottomPlayer";
import FullScreenPlayer from "./FullScreenPlayer";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";

interface Props { }

const Player: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore)

   const { song: songInStore } = songStore
   const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);

   // const activeSongThumbnail = useRef<HTMLDivElement>(null)
   const Player = useRef<HTMLDivElement>(null);
   const audioRef = useRef<HTMLAudioElement>(null)

   // const idle = useMouseMove(isOpenFullScreen);

   const content =
      <div ref={Player} className="fixed">
         <audio ref={audioRef} src={songInStore.path} className="hidden"></audio>

         <FullScreenPlayer
            // ref={activeSongThumbnail}

            idle={false}
            isOpenFullScreen={isOpenFullScreen}
            
            audioEle={audioRef.current as HTMLAudioElement}

            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <BottomPlayer
            idle={false && isOpenFullScreen}
            isOpenFullScreen={isOpenFullScreen}
            
            audioEle={audioRef.current as HTMLAudioElement}
            // activeSongThumbnailEle={activeSongThumbnail.current as HTMLElement}
            
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

      </div>


   return content;
};

export default Player;

import { ControlRef } from "@/modules/music-control";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

function usePlayer() {
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);
  const [isOpenSongQueue, setIsOpenSongQueue] = useState<boolean>(false);
  const [_isHasAudioEle, setIsHasAudioEle] = useState(false);
  const [activeTab, setActiveTab] = useState<"Songs" | "Karaoke" | "Lyric">("Lyric");
  const [idle, setIdle] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const controlRef = useRef<ControlRef>(null);

  return {
    audioRef,
    controlRef,
    isOpenFullScreen,
    isOpenSongQueue,
    idle,
    setIdle,
    setIsOpenFullScreen,
    setIsOpenSongQueue,
    setIsHasAudioEle,
    activeTab,
    setActiveTab,
  };
}

type ContextType = ReturnType<typeof usePlayer>;

const Context = createContext<ContextType | null>(null);

export default function PlayerContextProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={usePlayer()}>{children}</Context.Provider>;
}

export function usePlayerContext() {
  const ct = useContext(Context);
  if (!ct) throw new Error("Player Context not provided");
  return ct;
}

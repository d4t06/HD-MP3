// import { ControlRef } from "@/modules/music-control";
import { getLocalStorage } from "@/utils/appHelpers";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

const desktopTabs = ["Songs", "Karaoke", "Lyric"] as const;
const mobileTabs = ["Playing", "Lyric"] as const;

type Tab = (typeof desktopTabs)[number];
type MobileTab = (typeof mobileTabs)[number];

type LyricSize = "small" | "medium" | "large";
type Repeat = "one" | "all" | "no";

type PlayerConfig = {
  lyricSize: LyricSize;
  repeat: Repeat;
  isShuffle: boolean;
  isEnableBeat: boolean;
  isCrossFade: boolean;
  songBackground: boolean;
  songImage: boolean;
};

const storage = getLocalStorage();

function usePlayer() {
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);
  const [isOpenSongQueue, setIsOpenSongQueue] = useState<boolean>(false);
  // const [_isHasAudioEle, setIsHasAudioEle] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Lyric");
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>("Lyric");
  const [idle, setIdle] = useState(false);

  const [playerConfig, setPlayerConfig] = useState<PlayerConfig>({
    lyricSize: (storage["lyricSize"] || "medium") as LyricSize,
    repeat: (storage["isRepeat"] || "no") as Repeat,
    isShuffle: storage["isShuffle"] || false,
    isCrossFade: storage["isCrossFade"] || false,
    songBackground: storage["songBackground"] || true,
    songImage: storage["songImage"] || true,
    isEnableBeat: false,
  });

  const firstTimeSongLoaded = useRef(true);
  const startFadeWhenEnd = useRef(0); // for cross fade
  const isPlayingNewSong = useRef(true); // for cross fade
  const themeCodeRef = useRef("");
  const shouldSyncSongDuration = useRef(false);
  const timeLineColorRef = useRef("var(--primary-cl)");

  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineEleRef = useRef<HTMLDivElement>(null);
  const currentTimeEleRef = useRef<HTMLDivElement>(null);

  const updatePlayerConfig = (data: Partial<PlayerConfig>) => {
    setPlayerConfig((prev) => ({ ...prev, ...data }));
  };

  return {
    audioRef,
    themeCodeRef,
    isOpenFullScreen,
    isOpenSongQueue,
    idle,
    setIdle,
    setIsOpenFullScreen,
    setIsOpenSongQueue,
    // setIsHasAudioEle,
    activeTab,
    setActiveTab,
    desktopTabs,
    mobileActiveTab,
    setMobileActiveTab,
    mobileTabs,
    playerConfig,
    updatePlayerConfig,
    firstTimeSongLoaded,
    timelineEleRef,
    currentTimeEleRef,
    startFadeWhenEnd,
    isPlayingNewSong,
    shouldSyncSongDuration,
    timeLineColorRef,
  };
}

type ContextType = ReturnType<typeof usePlayer>;

const Context = createContext<ContextType | null>(null);

export default function PlayerProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={usePlayer()}>{children}</Context.Provider>;
}

export function usePlayerContext() {
  const ct = useContext(Context);
  if (!ct) throw new Error("Player Context not provided");
  return ct;
}

import { Status } from "@/hooks/useAudioControl";
import { splitStringByCutPositions } from "@/utils/lyricEditorHelper";
import {
  createContext,
  ElementRef,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type PlayerRef = {
  play: () => void;
  pause: () => void;
  handlePlayPause: () => void;
};

const tabs = ["Edit", "Record"] as const;
type TabType = (typeof tabs)[number];

function useLyricEditor() {
  const [wordIndex, setWordIndex] = useState(0);

  //   local data
  const [localLyricIndex, setLoacalLyricIndex] = useState<number>();
  const [text, setText] = useState("");
  const [cut, setCut] = useState<number[][]>([[]]);
  const [growList, setGrowList] = useState<number[]>([]);
  // const [isEditText, setIsEditText] = useState(false); // for keyboard event and text area
  const [isOpenEditLyricModal, SetIsOpenEditLyricModal] = useState(false); // for keyboard event
  // const [isChangeWordGrow, setIsChangeWordGrow] = useState(false); // for word-item keyboard event
  const [tab, setTab] = useState<TabType>("Edit");
  const [status, setStatus] = useState<Status>("paused");

  // const textRef = useRef<ElementRef<"textarea">>(null);
  const overlayRef = useRef<ElementRef<"div">>(null);
  const endTimeRangeRef = useRef<ElementRef<"input">>(null);
  const startTimeRangeRef = useRef<ElementRef<"input">>(null);
  const startRefText = useRef<ElementRef<"span">>(null);
  const endRefText = useRef<ElementRef<"span">>(null);
  const currentWordRef = useRef<HTMLDivElement | null>(null);
  const growInputRef = useRef<ElementRef<"input">>(null);
  const tempWordRef = useRef<ElementRef<"div">>(null);
  const playerRef = useRef<PlayerRef>();

  const isChangedRef = useRef(false);
  const actuallyEndRef = useRef(0);
  const actuallyStartRef = useRef(0);
  const tempActuallyStartRef = useRef(0);
  const wordsRatioRef = useRef<number[]>([]);
  const mergedGrowListRef = useRef<number[]>([]);

  // events
  const playWhenSpaceRef = useRef(true);
  const moveArrowToGrowRef = useRef(false);

  const currentWords = useMemo(() => text.split(" ").filter((v) => v.trim()), [text]);

  const currentWordsData = useMemo(() => {
    return currentWords.map((w, i) => ({
      text: w,
      positions: cut[i],
    }));
  }, [text, cut]);

  const currentSplitWords = useMemo(() => {
    const splitWords: string[] = [];

    currentWordsData.forEach((data) => {
      const words = splitStringByCutPositions(data.text, data.positions);
      splitWords.push(...words);
    });

    return splitWords.filter((w) => w);
  }, [text, cut]);

  return {
    eleRefs: {
      endTimeRangeRef,
      overlayRef,
      startTimeRangeRef,
      startRefText,
      endRefText,
      currentWordRef,
      growInputRef,
      tempWordRef,
    },

    tabProps: {
      tab,
      setTab,
      tabs,
    },

    eventRefs: {
      playWhenSpaceRef,
      moveArrowToGrowRef,
    },

    currentWords,
    currentWordsData,
    currentSplitWords,

    actuallyEndRef,
    playerRef,
    actuallyStartRef,
    tempActuallyStartRef,
    wordsRatioRef,
    mergedGrowListRef,
    isChangedRef,
    wordIndex,
    setWordIndex,
    growList,
    setGrowList,
    isOpenEditLyricModal,
    SetIsOpenEditLyricModal,
    setStatus,
    status,
    text,
    setText,
    cut,
    setCut,
    localLyricIndex,
    setLoacalLyricIndex,
  };
}

type ContextType = ReturnType<typeof useLyricEditor>;

const Context = createContext<ContextType | null>(null);

export default function LyricEditorProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useLyricEditor()}>{children}</Context.Provider>;
}

export const useLyricEditorContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("LyricEditorProvider not found");
  return context;
};

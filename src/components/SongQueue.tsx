import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  selectAllSongStore,
  setSong,
  useActuallySongs,
  useAuthStore,
  useTheme,
} from "../store";
import { Button, Modal, SongItemList, Tabs, TimerModal } from ".";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Song, User } from "../types";
import { SongWithSongIn } from "../store/SongSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import Skeleton from "./skeleton";
import {
  selectAllPlayStatusStore,
  setPlayStatus,
} from "../store/PlayStatusSlice";
import { initSongObject, sleep } from "../utils/appHelpers";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useLocalStorage } from "../hooks";

type Props = {
  isOpenSongQueue: boolean;
  setIsOpenSongQueue: Dispatch<SetStateAction<boolean>>;
};

function SongQueue({ isOpenSongQueue, setIsOpenSongQueue }: Props) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { userInfo } = useAuthStore();
  const { actuallySongs, setActuallySongs } = useActuallySongs();
  const {
    playStatus: { isTimer },
  } = useSelector(selectAllPlayStatusStore);
  const { song: songInStore } = useSelector(selectAllSongStore);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [activeTab, setActiveTab] = useState<"Queue" | "Recent">("Queue");
  const [historySongs, setHistorySongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const [_playHistory, setPlayHistory] = useLocalStorage<string[]>(
    "play_history",
    []
  );
  const [fetchLoading, setFetchLoading] = useState(false);

  const handleSetSong = (song: Song, index: number) => {
    // when user play playlist then play user songs

    if (index !== songInStore.currentIndex) {
      dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
    }
  };

  const handleSetHistorySong = (song: Song, index: number) => {
    if (index !== songInStore.currentIndex) {
      const newQueue = [...actuallySongs];
      newQueue.push(song);
      setActuallySongs(newQueue);
      console.log("setActuallySongs");

      dispatch(
        setSong({
          ...(song as SongWithSongIn),
          currentIndex: newQueue.length - 1,
        })
      );

      setActiveTab("Queue");
    }
  };

  const handleTimerBtn = () => {
    if (isTimer) return dispatch(setPlayStatus({ isTimer: 0 }));

    setIsOpenModal(true);
  };

  const clearSongQueue = () => {
    setIsOpenSongQueue(false);

    setActuallySongs([]);
    console.log("setActuallySongs");

    dispatch(setSong({ ...initSongObject({}), currentIndex: 0, song_in: "" }));
  };

  const clearHistory = async () => {
    try {
      setFetchLoading(true);
      await mySetDoc({
        collection: "users",
        data: { play_history: [] } as Partial<User>,
        id: userInfo.email,
      });
      setHistorySongs([]);
      setPlayHistory([]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoading(false);
      setActiveTab("Queue");
    }
  };

  const getHistorySong = async () => {
    try {
      const playHistory = JSON.parse(
        localStorage.getItem("play_history") || "[]"
      );

      // console.log("code run 1");
      await sleep(500);

      if (!playHistory.length) {
        setLoading(false);
        // console.log("code run 2");
        return;
      }

      const queryGetHistorySongs = query(
        collection(db, "songs"),
        where("id", "in", playHistory)
      );
      const songsSnap = await getDocs(queryGetHistorySongs);

      const songs = songsSnap.docs.map((doc) => {
        const data = doc.data() as Song;
        return {
          ...data,
          song_in: data.by === "admin" ? "admin" : "user",
        } as SongWithSongIn;
      });

      // await sleep(appConfig.loadingDuration);

      setHistorySongs(songs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userInfo.email) return;

    if (activeTab === "Recent") {
      getHistorySong();
    }

    return () => {
      setLoading(true);
    };
  }, [activeTab]);

  useEffect(() => {
    if (!userInfo.email) {
      setIsOpenSongQueue(false);
      setActiveTab("Queue");
    }
  }, [userInfo]);

  useEffect(() => {
    setTimeout(() => {
      if (!isOpenSongQueue) {
        setActiveTab("Queue");
      }
    }, 1000);
  }, [isOpenSongQueue]);

  const SongItemSkeleton = [...Array(4).keys()].map((index) => {
    return (
      <div
        key={index}
        className="flex items-center p-[10px] border-b-[1px] border-transparent"
      >
        <Skeleton className="h-[40px] w-[40px] rounded-[4px]" />
        <div className="ml-[10px]">
          <Skeleton className="h-[20px] mb-[5px] w-[120px]" />
          <Skeleton className="h-[12px] mt-[5px] w-[60px]" />
        </div>
      </div>
    );
  });

  const classes = {
    textColor: `${theme.type === "dark" ? "text-white" : "text-[#333]"} `,
    mainContainer: `fixed w-[260px] bottom-[0] right-[0] top-[0] z-20 px-[15px] ${theme.container} border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
  };

  // console.log("check loading", loading);

  return (
    <div
      className={`${classes.textColor} ${classes.mainContainer} ${
        isOpenSongQueue ? "translate-x-0---" : "translate-x-full"
      }     `}
    >
      <div className="flex items-center my-[10px] gap-[8px]">
        <Tabs
          className={`text-[13px] ${
            !userInfo.email ? "opacity-[.6] pointer-events-none" : ""
          }`}
          activeTab={activeTab}
          setActiveTab={userInfo.email ? setActiveTab : () => {}}
          tabs={["Queue", "Recent"]}
          render={(tab) => tab}
        />
        <Tooltip placement="bottom">
          <TooltipTrigger
            onClick={handleTimerBtn}
            className={`p-[8px] rounded-[50%] ${theme.content_hover_bg} ${
              isTimer ? theme.content_bg : theme.side_bar_bg
            }`}
          >
            <ClockIcon className="w-[20px]" />
          </TooltipTrigger>
          <TooltipContent>Add timer</TooltipContent>
        </Tooltip>
      </div>
      <div className="h-[calc(100vh-146px)] pb-[30px] overflow-y-auto overflow-x-hidden no-scrollbar">
        {activeTab === "Queue" && (
          <>
            <SongItemList
              inQueue
              songs={actuallySongs}
              handleSetSong={handleSetSong}
              activeExtend={true}
            />

            <div className="text-center">
              {!!actuallySongs.length && (
                <Button
                  onClick={clearSongQueue}
                  size={"small"}
                  className={`${theme.content_bg} rounded-full mt-[24px]`}
                >
                  Clear
                </Button>
              )}
            </div>
          </>
        )}
        {activeTab === "Recent" && (
          <>
            {loading ? (
              SongItemSkeleton
            ) : (
              <>
                <SongItemList
                  inQueue
                  inHistory
                  songs={historySongs}
                  handleSetSong={handleSetHistorySong}
                  activeExtend={true}
                />

                {!!historySongs.length && (
                  <p className="text-center">
                    <Button
                      onClick={clearHistory}
                      size={"small"}
                      className={`${theme.content_bg} rounded-full mt-[24px]`}
                    >
                      {fetchLoading ? (
                        <ArrowPathIcon className="w-[20px] animate-spin" />
                      ) : (
                        "Clear"
                      )}
                    </Button>
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
      {isOpenModal && (
        <Modal setOpenModal={setIsOpenModal} theme={theme}>
          <TimerModal setIsOpenModal={setIsOpenModal} theme={theme} />
        </Modal>
      )}
    </div>
  );
}

export default SongQueue;

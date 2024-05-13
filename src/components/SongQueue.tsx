import {
   Dispatch,
   SetStateAction,
   useCallback,
   useEffect,
   useMemo,
   useState,
} from "react";
import { useAuthStore, useTheme } from "../store";
import { Button, Modal, SongList, Tabs, TimerModal } from ".";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import Skeleton from "./skeleton";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { getLocalStorage, setLocalStorage, sleep } from "../utils/appHelpers";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useLocalStorage } from "../hooks";
import { resetCurrentSong, selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { addSongToQueue, resetSongQueue, selectSongQueue } from "@/store/songQueueSlice";

type Props = {
   isOpenSongQueue: boolean;
   setIsOpenSongQueue: Dispatch<SetStateAction<boolean>>;
};

type Modal = "timer";

function SongQueue({ isOpenSongQueue, setIsOpenSongQueue }: Props) {
   // store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { queueSongs } = useSelector(selectSongQueue);

   const {
      playStatus: { isTimer },
   } = useSelector(selectAllPlayStatusStore);
   const { currentSong } = useSelector(selectCurrentSong);

   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   const [activeTab, setActiveTab] = useState<"Queue" | "Recent">("Queue");
   const [historySongs, setHistorySongs] = useState<Song[]>([]);
   const [loading, setLoading] = useState(false);

   const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);
   const [fetchLoading, setFetchLoading] = useState(false);

   const closeModal = () => setIsOpenModal("");

   const handleSetSong = useCallback((song: Song, index: number) => {
      if (index !== currentSong.currentIndex) {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
      }
   }, []);

   const handleSetHistorySong = (song: Song, index: number) => {
      if (index !== currentSong.currentIndex) {
         dispatch(addSongToQueue({ songs: [song] }));

         dispatch(
            setSong({
               ...(song as SongWithSongIn),
               currentIndex: queueSongs.length - 1 + 1,
            })
         );

         setActiveTab("Queue");
      }
   };

   const handleTimerBtn = () => {
      if (isTimer) return dispatch(setPlayStatus({ isTimer: 0 }));
      setIsOpenModal("timer");
   };

   const clearSongQueue = useCallback(() => {
      setIsOpenSongQueue(false);

      // setActuallySongs([]);
      dispatch(resetSongQueue());
      // console.log("setActuallySongs");

      dispatch(resetCurrentSong());
      setLocalStorage("duration", 0);
   }, []);

   const clearHistory = async () => {
      try {
         if (!user) return;

         setFetchLoading(true);
         await mySetDoc({
            collection: "users",
            data: { play_history: [] } as Partial<User>,
            id: user.email,
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
         const storage = getLocalStorage();
         const playHistory = storage["play_history"] || [];

         await sleep(500);

         if (!playHistory.length) {
            setLoading(false);
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

         setHistorySongs(songs);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {
      if (!user) return;

      if (activeTab === "Recent") {
         getHistorySong();
      }

      return () => {
         setLoading(true);
      };
   }, [activeTab]);

   useEffect(() => {
      if (!user) return;

      if (!user.email) {
         setIsOpenSongQueue(false);
         setActiveTab("Queue");
      }
   }, [user]);

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
      mainContainer: `fixed w-[300px] bottom-[0] right-[0] top-[0] z-20 px-[15px] ${theme.container} border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
   };

   return (
      <div
         className={`${classes.textColor} ${classes.mainContainer} ${
            isOpenSongQueue ? "translate-x-0---" : "translate-x-full"
         }     `}
      >
         <div className="flex items-center justify-between my-[10px]">
            <Tabs
               className={`text-[13px] ${
                  !user?.email ? "opacity-[.6] pointer-events-none" : ""
               }`}
               activeTab={activeTab}
               setActiveTab={user?.email ? setActiveTab : () => {}}
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
                  {/* <SongList
                     variant="queue"
                     songs={queueSongs}
                     handleSetSong={handleSetSong}
                  /> */}
                  {useMemo(
                     () => (
                        <SongList
                           variant="queue"
                           songs={queueSongs}
                           handleSetSong={handleSetSong}
                        />
                     ),
                     [queueSongs]
                  )}
                  <div className="text-center">
                     {!!queueSongs.length && (
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
                        <SongList
                           variant="queue"
                           songs={historySongs}
                           handleSetSong={handleSetHistorySong}
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
         {!!isOpenModal && (
            <Modal closeModal={closeModal}>
               <TimerModal close={closeModal} />
            </Modal>
         )}
      </div>
   );
}

export default SongQueue;

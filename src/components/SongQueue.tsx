import { memo, useCallback } from "react";
import { usePlayerContext, useThemeContext } from "../stores";
import { Button, SongList } from ".";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSongQueue,
  selectSongQueue,
  setCurrentQueueId,
} from "@/stores/redux/songQueueSlice";
import SongSelectProvider from "@/stores/SongSelectContext";

function SongQueue() {
  // stores
  const dispatch = useDispatch();
  const { theme } = useThemeContext();
  const { isOpenSongQueue, setIsOpenSongQueue, controlRef } = usePlayerContext();
  const { queueSongs, currentQueueId } = useSelector(selectSongQueue);

  const handleSetSong = useCallback(
    (queueId: string) => {
      if (queueId !== currentQueueId) {
        dispatch(setCurrentQueueId(queueId));
      }
    },
    [currentQueueId]
  );

  const clearSongQueue = useCallback(() => {
    dispatch(resetSongQueue());
    controlRef.current?.resetForNewSong()
    
    setIsOpenSongQueue(false);
  }, []);

  const classes = {
    mainContainer: `fixed w-[300px] flex flex-col bottom-[80px] right-[0] top-[0] z-20 px-3 pt-4 ${theme.container} border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
    songListContainer:
      "flex-grow overflow-y-auto pb-[10px] overflow-x-hidden no-scrollbar",
  };

  return (
    <SongSelectProvider>
      <div
        className={`${theme.text_color} ${classes.mainContainer} ${
          isOpenSongQueue ? "translate-x-0---" : "translate-x-full"
        }     `}
      >
        <div className="leading-[2.2] font-playwriteCU mb-2">Song queue</div>

        <div className={classes.songListContainer}>
          <>
            <div className="">
              <SongList
                variant="queue"
                songs={queueSongs}
                handleSetSong={handleSetSong}
              />
            </div>
            <div className="text-center">
              {!!queueSongs.length && (
                <Button
                  onClick={clearSongQueue}
                  size={"clear"}
                  className={`${theme.content_bg} rounded-full my-5 px-3 py-1 space-x-1`}
                >
                  <TrashIcon className="w-6" />
                  <span className="font-playwriteCU leading-[2.2]">Clear</span>
                </Button>
              )}
            </div>
          </>
        </div>
      </div>
    </SongSelectProvider>
  );
}

export default memo(SongQueue);

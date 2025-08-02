import { memo, useCallback, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSongQueue,
  selectSongQueue,
  setCurrentQueueId,
} from "@/stores/redux/songQueueSlice";
import SongSelectProvider from "@/stores/SongSelectContext";
import { Button, Skeleton, Tab } from "@/components";
import { usePlayerContext } from "@/stores";
import SongList from "../song-item/_components/SongList";
import RecentSong from "./_components/RecentSong";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";

const tabs = ["Queue", "Recent"] as const;

export type QueueTab = (typeof tabs)[number];

function SongQueue() {
  // stores
  const dispatch = useDispatch();
  const { isOpenSongQueue, setIsOpenSongQueue } = usePlayerContext();
  const { queueSongs, currentQueueId, isFetching } =
    useSelector(selectSongQueue);

  const { resetForNewSong } = usePlayerAction();

  const [tab, setTab] = useState<QueueTab>("Queue");

  const handleSetSong = useCallback(
    (queueId: string) => {
      if (queueId !== currentQueueId) {
        dispatch(setCurrentQueueId(queueId));
      }
    },
    [currentQueueId],
  );

  const clearSongQueue = useCallback(() => {
    dispatch(resetSongQueue());
    resetForNewSong();

    setIsOpenSongQueue(false);
  }, []);

  const skeleton = [...Array(5).keys()].map((i) => (
    <Skeleton key={i} className="h-[56px] mt-1 rounded-md" />
  ));

  const classes = {
    mainContainer: `hidden fixed w-[300px] md:flex flex-col bottom-[80px] right-[0] top-[0] z-20 px-3 pt-4 bg-[--layout-cl] border-l-[1px] border-[--a-5-cl] transition-[transform] duration-[.5s] linear delay-100`,
    songListContainer:
      "flex-grow overflow-y-auto pb-[10px] overflow-x-hidden no-scrollbar mt-3",
  };

  return (
    <SongSelectProvider>
      <div
        className={`${classes.mainContainer} ${
          isOpenSongQueue ? "translate-x-0---" : "translate-x-full"
        }     `}
      >
        <Tab
          className="w-fit mx-auto text-sm"
          tab={tab}
          setTab={setTab}
          tabs={tabs}
          render={(t) => t}
        />

        <div className={classes.songListContainer}>
          {tab === "Queue" ? (
            <>
              <SongList
                isHasCheckBox={false}
                songs={queueSongs}
                setSong={(s) => handleSetSong(s.queue_id)}
                songVariant="queue-song"
                getActive={(s, cur) => s.queue_id === cur.queue_id}
              />

              {isFetching && skeleton}

              <div className="text-center">
                {!!queueSongs.length && (
                  <Button
                    onClick={clearSongQueue}
                    size={"clear"}
                    color="primary"
                    className={`rounded-full my-5 px-3 py-1 space-x-1`}
                  >
                    <TrashIcon className="w-6" />
                    <span className="font-playwriteCU leading-[2.2]">
                      Clear
                    </span>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <RecentSong setTab={setTab} />
          )}
        </div>
      </div>
    </SongSelectProvider>
  );
}

export default memo(SongQueue);

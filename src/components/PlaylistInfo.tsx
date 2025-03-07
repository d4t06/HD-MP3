import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem, Skeleton } from "@/components";
import { ReactNode } from "react";

type Props = {
  loading: boolean;
  children: ReactNode;
};

export default function PLaylistInfo({ loading, children }: Props) {
  // stores
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const isActivePlaylist =
    (playStatus === "playing" || playStatus === "waiting") &&
    currentSongData?.song.queue_id.includes(`${currentPlaylist?.id}`);

  const playlistInfoSkeleton = (
    <>
      <Skeleton className="h-[38px] mb-[6px] w-[200px]" />
    </>
  );

  const renderInfo = () => {
    if (loading) return playlistInfoSkeleton;

    return (
      <>
        <div className="text-xl leading-[2.2] font-playwriteCU">
          {currentPlaylist?.name}
        </div>
      </>
    );
  };

  const classes = {
    container: "flex flex-col md:flex-row lg:flex-col",
    playlistInfoContainer: `flex flex-col md:justify-between md:ml-3 lg:ml-0 mt-3 md:mt-0 lg:mt-3`,
    infoTop:
      "flex justify-center items-center space-y-1 md:flex-col md:items-start lg:items-center",
    ctaContainer: `flex justify-center space-x-3 md:justify-start lg:justify-center mt-3 md:mt-0 lg:mt-3`,
  };

  return (
    <>
      <div className={classes.container}>
        <div className="w-full flex-shrink-0 px-10 md:w-1/4 md:px-0 lg:w-full">
          {loading ? (
            <Skeleton className="pt-[100%] rounded-lg" />
          ) : (
            currentPlaylist && (
              <PlaylistItem data={currentPlaylist} active={isActivePlaylist} inDetail />
            )
          )}
        </div>

        <div className={classes.playlistInfoContainer}>
          <div className={classes.infoTop}>{renderInfo()}</div>

          <div className={`${classes.ctaContainer} `}>{!loading && children}</div>
        </div>
      </div>
    </>
  );
}

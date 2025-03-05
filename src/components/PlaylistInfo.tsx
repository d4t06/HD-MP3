import { useSelector } from "react-redux";
// import { useThemeContext } from "../stores";
// import { useMemo } from "react";
// import { formatTime } from "../utils/appHelpers";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
// import PlaylistInfoCta from "./PlaylistInfoCta";
import { PlaylistItem, Skeleton } from "@/components";
import { ReactNode } from "react";

// type MyPlaylist = {
//   variant: "my-playlist";
//   loading: boolean;
// };

// type AdminPlaylist = {
//   variant: "sys-playlist";
//   loading: boolean;
// };

// type DashboardPlaylist = {
//   variant: "dashboard-playlist";
//   loading: boolean;
// };

// type Props = MyPlaylist | AdminPlaylist | DashboardPlaylist;

type Props = {
  loading: boolean;
  children: ReactNode;
};

export default function PLaylistInfo({ loading, children }: Props) {
  // stores
  // const { isOnMobile } = useThemeContext();
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  // const playlistTime = useMemo(
  //   () => playlistSongs.reduce((prev, c) => prev + c.duration, 0),
  //   [playlistSongs],
  // );

  const isActivePlaylist =
    (playStatus === "playing" || playStatus === "waiting") &&
    currentSongData?.song.song_in === `playlist_${currentPlaylist?.id}`;

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
        {/*{!isOnMobile && props.variant !== "dashboard-playlist" && (
          <p className="text-lg leading-[1] font-[500]">{formatTime(playlistTime)}</p>
        )}
        {props.variant !== "dashboard-playlist" && (
          <p className="hidden md:block opacity-60 leading-[1]">
            created by {currentPlaylist?.by}
          </p>
        )}*/}
      </>
    );
  };

  //   const renderCta = () => {
  //     switch (props.variant) {
  //       case "my-playlist":
  //       case "sys-playlist":
  //         return <PlaylistInfoCta variant={props.variant} />;
  //       case "dashboard-playlist":
  //         return <DashboardPlaylistCta />;
  //     }
  //   };

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

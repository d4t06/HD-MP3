import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem, Skeleton } from "@/components";
import EditPlaylistBtn from "./_components/EditPlaylistBtn";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";
import { convertTimestampToString } from "@/utils/appHelpers";

type Props = {
  playlist: Playlist | null;
  variant: "my-playlist" | "others-playlist";
  isLiked: boolean | null;
  showSkeleton: boolean;
};

export default function PLaylistInfo({
  playlist,
  showSkeleton,
  isLiked,
  variant,
}: Props) {
  // stores
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const isActivePlaylist = playlist
    ? (playStatus === "playing" || playStatus === "waiting") &&
      currentSongData?.song.queue_id.includes(`${playlist.id}`)
    : false;

  const classes = {
    container: "flex flex-col md:flex-row lg:flex-col",
    playlistInfoContainer: `flex flex-col md:justify-between md:ml-3 lg:ml-0 mt-3 md:mt-0 lg:mt-3`,
    infoTop: "flex flex-col items-center md:items-start lg:items-center space-y-1",
    ctaContainer: `flex justify-center space-x-3 md:justify-start lg:justify-center mt-3 md:mt-0 lg:mt-3`,
    smallText: "text-sm leading-[1.2] opacity-[.7]",
  };

  return (
    <>
      <div className={classes.container}>
        <div className="w-full flex-shrink-0 px-10 md:w-1/4 md:px-0 lg:w-full">
          {showSkeleton ? (
            <Skeleton className="pt-[100%] rounded-lg" />
          ) : (
            playlist && (
              <PlaylistItem data={playlist} active={isActivePlaylist} inDetail />
            )
          )}
        </div>

        <div className={classes.playlistInfoContainer}>
          <div className={classes.infoTop}>
            {showSkeleton ? (
              <>
                <Skeleton className="h-[24px] w-[170px]" />
                <Skeleton className="h-[17px] w-[170px]" />
                <Skeleton className="h-[17px] w-[60px]" />
                <Skeleton className="h-[17px] w-[100px]" />
              </>
            ) : (
              playlist && (
                <>
                  <p className="text-xl leading-[1.2]">
                    {playlist.name}
                    {import.meta.env.DEV && (
                      <span>
                        {" "}
                        ({variant}) public: {playlist.is_public + ""}
                      </span>
                    )}
                  </p>
                  <p className={classes.smallText}>{playlist.distributor}</p>
                  {variant === "my-playlist" && (
                    <p className={classes.smallText}>
                      {playlist.is_public ? "Public" : "Private"}
                    </p>
                  )}
                  {variant === "others-playlist" && (
                    <>
                      <p className={classes.smallText}>{playlist.play_count} plays</p>
                      <p className="text-xs leading-[1.2] opacity-[.7]">
                        Last update:{" "}
                        {convertTimestampToString(playlist.updated_at, { type: "date" })}
                      </p>
                    </>
                  )}
                </>
              )
            )}
          </div>

          <div className={`${classes.ctaContainer}`}>
            {playlist && (
              <>
                <PlayPlaylistBtn />
                {variant === "my-playlist" ? (
                  <EditPlaylistBtn />
                ) : (
                  isLiked !== null && (
                    <HearBtn
                      className="w-[43px] flex justify-center"
                      isLiked={isLiked}
                      playlist={playlist}
                    />
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

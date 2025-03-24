import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
// import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem, Skeleton } from "@/components";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";
import { convertTimestampToString } from "@/utils/appHelpers";
import PlaylistMenuBtn from "./_components/PlaylistMenuBtn";

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
  // const { playStatus } = useSelector(selectAllPlayStatusStore);

  const isActivePlaylist = playlist
    ? currentSongData?.song.queue_id.includes(`${playlist.id}`)
    : false;

  const classes = {
    container: "flex flex-col md:flex-row lg:flex-col",
    smallText: "text-xs leading-[1.3] opacity-[.7] line-clamp-2",
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

        <div className="flex flex-col text-center mt-3 md:text-left md:ml-5 md:mt-0 lg:ml-0 lg:mt-3">
          {showSkeleton ? (
            <div className="space-y-1 mb-3">
              <Skeleton className="h-[24px] w-[170px]" />
              <Skeleton className="h-[17px] w-[170px]" />
              <Skeleton className="h-[17px] w-[60px]" />
              <Skeleton className="h-[17px] w-[100px]" />
            </div>
          ) : (
            playlist && (
              <div className="space-y-1 mb-3">
                <p className="text-xl font-[600] leading-[1.2]">
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
                    <p className={classes.smallText}>{playlist.like} likes</p>
                    <p className={classes.smallText}>
                      {playlist.singers.map((s, i) => (!!i ? ", " : "") + s.name)}
                    </p>
                    <p className={classes.smallText}>
                      Last update:{" "}
                      {convertTimestampToString(playlist.updated_at, { type: "date" })}
                    </p>
                  </>
                )}
              </div>
            )
          )}

          {playlist && (
            <div className="flex flex-col items-center md:flex-row md:mt-auto lg:flex-col">
              <PlayPlaylistBtn />
              <div className="flex space-x-3 mt-3 md:ml-3 md:mt-0 lg:mt-3 lg:ml-0">
                <PlaylistMenuBtn variant={variant} />

                {variant !== "my-playlist" && isLiked !== null && <HearBtn isLiked={isLiked} playlist={playlist} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

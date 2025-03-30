import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
// import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem, Skeleton } from "@/components";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";
import { convertTimestampToString } from "@/utils/appHelpers";
import PlaylistMenuBtn from "./_components/PlaylistMenuBtn";
import { Link } from "react-router-dom";
import { useThemeContext } from "@/stores";

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
  const { theme } = useThemeContext();
  const { currentSongData } = useSelector(selectSongQueue);
  // const { playStatus } = useSelector(selectAllPlayStatusStore);

  const isActivePlaylist = playlist
    ? currentSongData?.song.queue_id.includes(`${playlist.id}`)
    : false;

  const classes = {
    container: "flex flex-col md:flex-row lg:flex-col",
    smallText: "text-xs",
  };

  const renderAlbumInfo = () => {
    if (!playlist) return <></>;

    return (
      <>
        <Link
          className={`hover:underline ${theme.content_hover_text} ${classes.smallText}`}
          to={`/singer/${playlist.singers[0].id}}`}
        >
          {playlist.singers[0].name}
        </Link>
        <p className={classes.smallText}>{playlist.like} likes</p>
      </>
    );
  };

  const renderPlaylistInfo = () => {
    if (!playlist) return <></>;

    switch (variant) {
      case "my-playlist":
        return (
          <p className={classes.smallText}>{playlist.is_public ? "Public" : "Private"}</p>
        );
      case "others-playlist":
        return (
          <>
            <p className={classes.smallText}>{playlist.like} likes</p>
            <p className={classes.smallText}>
              {playlist.singers.map((s, i) => (
                <span>{(!!i ? ", " : "") + s.name}</span>
              ))}
            </p>
            <p className={classes.smallText}>
              Last update:{" "}
              {convertTimestampToString(playlist.updated_at, {
                type: "date",
              })}
            </p>
          </>
        );
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className="w-full flex-shrink-0 px-10 md:w-1/3 md:px-0 lg:w-full">
          {showSkeleton ? (
            <Skeleton className="pt-[100%] rounded-lg" />
          ) : (
            playlist && (
              <PlaylistItem data={playlist} active={isActivePlaylist} variant="image" />
            )
          )}
        </div>

        <div className="flex flex-col text-center mt-3 md:text-left md:ml-5 md:mt-0 lg:ml-0 lg:mt-3 lg:text-center">
          {showSkeleton ? (
            <div className="space-y-1 my-3">
              <Skeleton className="h-[24px] w-[170px]" />
              <Skeleton className="h-[17px] w-[170px]" />
              <Skeleton className="h-[17px] w-[60px]" />
              <Skeleton className="h-[17px] w-[100px]" />
            </div>
          ) : (
            playlist && (
              <>
                <p className="text-xl font-[600] leading-[1.2]">{playlist.name}</p>
                <div className="flex-col items-center flex mt-2.5 text-[#666]">
                  {playlist.is_album ? renderAlbumInfo() : renderPlaylistInfo()}
                </div>
              </>
            )
          )}

          {playlist && (
            <div className="flex flex-col items-center md:flex-row md:mt-auto lg:flex-col lg:mt-3">
              <PlayPlaylistBtn />
              <div className="flex space-x-3 mt-3 md:ml-3 md:mt-0 lg:mt-3 lg:ml-0">
                <PlaylistMenuBtn variant={variant} />

                {variant !== "my-playlist" && isLiked !== null && (
                  <HearBtn isLiked={isLiked} playlist={playlist} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
// import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem, Skeleton, Title } from "@/components";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";
import PlaylistMenuBtn from "./_components/PlaylistMenuBtn";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import ChatBtn from "./_components/ChatBtn";
import CommentProvider from "../comment/components/CommentContext";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";

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
    smallText: "",
    link: `hover:text-[--primary-cl] hover:underline`,
  };

  const renderAlbumInfo = () => {
    if (!playlist) return <></>;

    return (
      <>
        <Link
          className={`block hover:underline hover:text-[--primary-cl] ${classes.smallText}`}
          to={`/singer/${playlist.singers[0].id}`}
        >
          {playlist.singers[0].name}
        </Link>
        <p className="text-sm">
          <span>❤️ </span>
          {abbreviateNumber(playlist.like)}
        </p>
      </>
    );
  };

  const renderPlaylistInfo = () => {
    if (!playlist) return <></>;

    switch (variant) {
      case "my-playlist":
        return (
          <>
            <p className={classes.smallText}>
              {playlist.is_public ? "Public" : "Private"}
            </p>
          </>
        );
      case "others-playlist":
        return (
          <>
            <p>
              <span className="text-base">❤️ </span>
              {abbreviateNumber(playlist.like)}
            </p>
            {!!playlist.singers.length && (
              <p className={classes.smallText}>
                {playlist.singers.map((s, i) => (
                  <Link
                    key={i}
                    className={`${classes.link}`}
                    to={`/singer/${s.id}`}
                  >
                    {(!!i ? ", " : "") + s.name}
                  </Link>
                ))}
              </p>
            )}

            {!playlist.is_official && (
              <p className={classes.smallText}>
                Provided by{" "}
                <Link
                  className={classes.link}
                  to={`/user/${playlist.owner_email}`}
                >
                  {playlist.distributor}
                </Link>
              </p>
            )}
            <p className={classes.smallText}>
              Last update:{" "}
              {dateFromTimestamp(playlist.updated_at, {
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
        <div className="md:w-[200px] lg:w-full">
          {showSkeleton ? (
            <Skeleton className="pt-[100%] rounded-lg" />
          ) : (
            playlist && (
              <PlaylistItem
                data={playlist}
                active={isActivePlaylist}
                variant="image"
              />
            )
          )}
        </div>

        <div
          className={`flex flex-col items-center mt-3 md:items-start md:ml-5 md:mt-0 lg:ml-0 lg:mt-3 lg:items-center`}
        >
          {showSkeleton ? (
            <div className="space-y-1 flex flex-col items-center">
              <Skeleton className="h-[24px] w-[170px]" />
              <Skeleton className="h-[17px] w-[170px]" />
              <Skeleton className="h-[17px] w-[60px]" />
              <Skeleton className="h-[17px] w-[100px]" />
            </div>
          ) : (
            playlist && (
              <>
                <Title
                  className="text-center"
                  variant={"h2"}
                  title={playlist.name}
                />
                <div className="mt-2.5 text-[#666] text-center md:text-left lg:text-center text-sm">
                  {playlist.is_album ? renderAlbumInfo() : renderPlaylistInfo()}
                </div>
              </>
            )
          )}

          {playlist && (
            <div className="flex flex-col items-center mt-3 md:flex-row md:mt-auto lg:flex-col lg:mt-3">
              <PlayPlaylistBtn />
              <div className="flex space-x-3 mt-3 md:ml-3 md:mt-0 lg:mt-3 lg:ml-0 hover:[&_button]:bg-[--a-5-cl] [&_button]:p-2">
                <PlaylistMenuBtn variant={variant} />

                {variant !== "my-playlist" && isLiked !== null && (
                  <HearBtn isLiked={isLiked} playlist={playlist} />
                )}

                <CommentProvider target="playlist">
                  <ChatBtn playlist={playlist} />
                </CommentProvider>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

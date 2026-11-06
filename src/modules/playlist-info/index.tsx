import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import {  PlaylistItem, Skeleton } from "@/components";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";
import PlaylistMenuBtn from "./_components/PlaylistMenuBtn";
// import { Link } from "react-router-dom";
// import { abbreviateNumber } from "@/utils/abbreviateNumber";
import ChatBtn from "./_components/ChatBtn";
import CommentProvider from "../comment/components/CommentContext";
// import { dateFromTimestamp } from "@/utils/dateFromTimestamp";

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

  const isActivePlaylist = playlist
    ? currentSongData?.song.queue_id.includes(`${playlist.id}`)
    : false;

  const classes = {
    container: "flex flex-row lg:flex-col",
    smallText: "",
    link: `hover:text-[--primary-cl] hover:underline`,
  };

  // const renderAlbumInfo = () => {
  //   if (!playlist) return <></>;

  //   return (
  //     <>
  //       <Link
  //         className={`block hover:underline hover:text-[--primary-cl] ${classes.smallText}`}
  //         to={`/singer/${playlist.singers[0].id}`}
  //       >
  //         {playlist.singers[0].name}
  //       </Link>

  //       <PEmoji className="font-bold text-lg">
  //         <img src="./icons/heart.png" alt="" />
  //         {abbreviateNumber(playlist.like)}
  //       </PEmoji>
  //     </>
  //   );
  // };

  // const renderPlaylistInfo = () => {
  //   if (!playlist) return <></>;

  //   switch (variant) {
  //     case "my-playlist":
  //       return (
  //         <>
  //           <p className={classes.smallText}>
  //             {playlist.is_public ? "Public" : "Private"}
  //           </p>
  //         </>
  //       );
  //     case "others-playlist":
  //       return (
  //         <>
  //           <PEmoji size={"4"} className="font-bold text-sm">
  //             <img src="./icons/heart.png" alt="" />
  //             {abbreviateNumber(playlist.like)}
  //           </PEmoji>
  //           {!!playlist.singers.length && (
  //             <p className={classes.smallText}>
  //               {playlist.singers.map((s, i) => (
  //                 <Link
  //                   key={i}
  //                   className={`${classes.link}`}
  //                   to={`/singer/${s.id}`}
  //                 >
  //                   {(!!i ? ", " : "") + s.name}
  //                 </Link>
  //               ))}
  //             </p>
  //           )}

  //           {!playlist.is_official && (
  //             <p className={classes.smallText}>
  //               Provided by{" "}
  //               <Link
  //                 className={classes.link}
  //                 to={`/user/${playlist.owner_email}`}
  //               >
  //                 {playlist.distributor}
  //               </Link>
  //             </p>
  //           )}
  //         </>
  //       );
  //   }
  // };

  return (
    <>
      <div className={classes.container}>
        <div className="w-[150px] md:w-[200px] mr-5 lg:w-full">
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
          className={`flex flex-col items-start lg:ml-0 lg:mt-3 lg:items-center`}
        >
          {showSkeleton ? (
            <div className="space-y-1 flex flex-col items-center md:items-start lg:items-center">
              <Skeleton className="h-[30px] w-[170px]" />
              {/*<Skeleton className="h-[17px] w-[170px]" />*/}
              {/*<Skeleton className="h-[17px] w-[100px]" />*/}
            </div>
          ) : (
            playlist && (
              <>
                <p className="text-2xl font-bold">{playlist.name}</p>

                {/*<div className="mt-2.5 text-center md:text-left lg:text-center text-xs item-info">
                  {playlist.is_album ? renderAlbumInfo() : renderPlaylistInfo()}
                </div>*/}
              </>
            )
          )}

          {playlist && (
            <div className="flex flex-col mt-3">
              <PlayPlaylistBtn />
              <div className="flex space-x-3 mt-3 lg:justify-center hover:[&_button]:bg-[--a-5-cl] [&_button]:p-2 [&_button]:flex-shrink-0">
                <PlaylistMenuBtn variant={variant} />

                {isLiked !== null && (
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

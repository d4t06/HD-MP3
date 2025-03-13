import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PlaylistItem } from "@/components";
import EditPlaylistBtn from "./_components/EditPlaylistBtn";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import HearBtn from "./_components/HearBtn";

type Props = {
  playlist: Playlist;
  variant: "my-playlist" | "others-playlist";
  isLiked: boolean;
};

export default function PLaylistInfo({ playlist, isLiked, variant }: Props) {
  // stores
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const isActivePlaylist =
    (playStatus === "playing" || playStatus === "waiting") &&
    currentSongData?.song.queue_id.includes(`${playlist.id}`);

  const classes = {
    container: "flex flex-col md:flex-row lg:flex-col",
    playlistInfoContainer: `flex flex-col md:justify-between md:ml-3 lg:ml-0 mt-3 md:mt-0 lg:mt-3`,
    infoTop:
      "flex justify-center items-center md:flex-col md:items-start lg:items-center",
    ctaContainer: `flex justify-center space-x-3 md:justify-start lg:justify-center mt-3 md:mt-0 lg:mt-3`,
  };

  return (
    <>
      <div className={classes.container}>
        <div className="w-full flex-shrink-0 px-10 md:w-1/4 md:px-0 lg:w-full">
          <PlaylistItem data={playlist} active={isActivePlaylist} inDetail />
        </div>

        <div className={classes.playlistInfoContainer}>
          <div className={classes.infoTop}>
            <p className="text-xl">{playlist.name}</p>
            <p className="text-sm opacity-[.7]">{playlist.distributor}</p>
          </div>

          <div className={`${classes.ctaContainer}`}>
            <PlayPlaylistBtn />
            {variant === "my-playlist" ? (
              <EditPlaylistBtn />
            ) : (
              <HearBtn className="w-[43px] flex justify-center" isLiked={isLiked} playlist={playlist} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { PlaylistItem, Title } from "@/components";
import { playlistSkeleton } from "@/components/skeleton";
import useGetRecentPlaylist from "@/hooks/useGetRecentPlaylist";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function RecentPlaylist() {
  const { currentSongData } = useSelector(selectSongQueue);

  const ranEffect = useRef(false);

  const { isFetching, getRecentPlaylist, recentPlaylists } =
    useGetRecentPlaylist();

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getRecentPlaylist();
    }
  }, []);

  // const classes = {
  //   playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
  // };

  const renderPlaylists = () => {
    return recentPlaylists.map((playlist, index) => {
      const active = currentSongData?.song.queue_id.includes(playlist.id);

      return (
        <PlaylistItem key={index} variant="link" active={active} data={playlist} />
      );
    });
  };

  if (isFetching)
    return (
      <div className={`flex flex-row flex-wrap -mx-3 `}>
        {playlistSkeleton}
      </div>
    );

  if (!recentPlaylists.length) return <></>;

  return (
    <>
      <div>
        <Title title="Recent listening" />
        <div className={`flex flex-row flex-wrap -mx-3 `}>
          {renderPlaylists()}
        </div>
      </div>
    </>
  );
}

import { Button, PlaylistItem, Title } from "@/components";
import { playlistSkeleton } from "@/components/skeleton";
import useGetRecentPlaylist from "@/hooks/useGetRecentPlaylist";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function RecentPlaylist() {
  const { currentSongData } = useSelector(selectSongQueue);

  const ranEffect = useRef(false);

  const { isFetching, getRecentPlaylist, recentPlaylists, clear } =
    useGetRecentPlaylist();

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getRecentPlaylist();
    }
  }, []);

  const renderPlaylists = () => {
    return recentPlaylists.map((playlist, index) => {
      const active = currentSongData?.song.queue_id.includes(playlist.id);

      return (
        <PlaylistItem
          key={index}
          variant="link"
          active={active}
          data={playlist}
        />
      );
    });
  };

  if (isFetching)
    return (
      <div className={`flex flex-row flex-wrap -mx-3 `}>{playlistSkeleton}</div>
    );

  if (!recentPlaylists.length) return <></>;

  return (
    <>
      <div>
        <div className="flex justify-between">
          <Title title="Recent listening" />

          <Button
            onClick={clear}
            size={"clear"}
            className="text-[--primary-cl]"
          >
            Clear
          </Button>
        </div>
        <div className={`flex flex-row flex-wrap -mx-3 `}>
          {renderPlaylists()}
        </div>
      </div>
    </>
  );
}

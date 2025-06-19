import { useSelector } from "react-redux";
import { NotFound, PlaylistItem } from ".";
import { PlaylistSkeleton } from "./skeleton";

import { selectSongQueue } from "@/stores/redux/songQueueSlice";

type Props = {
  className?: string;
  loading: boolean;
  playlists: Playlist[];
};

export default function PlaylistList({ className = "", playlists, loading }: Props) {
  const { currentSongData } = useSelector(selectSongQueue);

  const render = () => {
    if (!playlists.length) return <NotFound className="mx-auto" />;

    return playlists.map((playlist, index) => {
      const active = currentSongData?.song.queue_id.includes(playlist.id);

      return (
        <div key={index} className="p-2 w-1/2 sm:w-1/3 md:w-1/4">
          <PlaylistItem active={active} data={playlist} />
        </div>
      );
    });
  };

  return (
    <>
      <div className={`flex flex-row flex-wrap -mx-[8px] ${className}`}>
        {loading && PlaylistSkeleton}
        {!loading && render()}
      </div>
    </>
  );
}

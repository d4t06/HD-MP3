import { useSelector } from "react-redux";
import { NotFound, PlaylistItem } from ".";
import { PlaylistSkeleton } from "./skeleton";
import { ReactNode } from "react";

import { selectSongQueue } from "@/stores/redux/songQueueSlice";

type Props = {
  className?: string;
  loading: boolean;
  playlists: Playlist[];
  children?: ReactNode;
};

export default function PlaylistList({ className = "", playlists, loading }: Props) {
  const { currentSongData } = useSelector(selectSongQueue);

  const classes = {
    playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
  };

  const render = () => {
    if (!playlists.length) return <NotFound className="mx-auto" />;

    return playlists.map((playlist, index) => {
      const active = currentSongData?.song.queue_id.includes(playlist.id);

      return (
        <div key={index} className={classes.playlistItem}>
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

import { useSelector } from "react-redux";
import { NotFound, PlaylistItem } from ".";

import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { ReactNode } from "react";

type Props = {
  className?: string;
  loading: boolean;
  playlists: Playlist[];
  skeNumber?: number;
  whenEmpty?: ReactNode;
};

export default function PlaylistList({
  className = "",
  playlists,
  loading,
  skeNumber = 2,
  whenEmpty,
}: Props) {
  const { currentSongData } = useSelector(selectSongQueue);

  const render = () => {
    if (!playlists.length)
      return whenEmpty || <NotFound variant="less" className="mx-auto" />;

    return playlists.map((playlist, index) => {
      const active = currentSongData?.song.queue_id.includes(playlist.id);

      return (
        <PlaylistItem
          variant="link"
          key={index}
          active={active}
          data={playlist}
        />
      );
    });
  };

  return (
    <>
      <div
        className={`${!loading && !playlists.length ? "" : "flex flex-row flex-wrap -mx-3"} ${className}`}
      >
        {loading &&
          [...Array(skeNumber).keys()].map((index) => (
            <PlaylistItem key={index} variant="skeleton" />
          ))}
        {!loading && render()}
      </div>
    </>
  );
}

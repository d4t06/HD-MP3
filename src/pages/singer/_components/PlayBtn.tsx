import { Button } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import { selectAllPlayStatusStore, setPlayStatus } from "@/stores/redux/PlayStatusSlice";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSingerContext } from "./SingerContext";

type PlayBtnProps = {
  children: ReactNode;
  onClick: () => void;
};

function PlayBtn({ onClick, children }: PlayBtnProps) {
  const { songs } = useSingerContext();

  return (
    <Button
      onClick={onClick}
      disabled={!songs.length}
      size={"clear"}
      color="primary"
      className={`p-3`}
    >
      {children}
    </Button>
  );
}

export default function PlaySingerSongBtn() {
  const dispatch = useDispatch();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const { handleSetSong } = useSetSong({ variant: "playlist" });

  const handlePlay = () => {
    const firstSong = playlistSongs[0];
    handleSetSong(firstSong.queue_id, playlistSongs);
  };

  const handlePlayPause = () => {
    switch (playStatus) {
      case "playing":
        return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
      case "paused":
        return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
    }
  };

  switch (playStatus) {
    case "loading":
    case "paused":
      return (
        <PlayBtn onClick={handlePlayPause}>
          <PlayIcon className="w-7" />
        </PlayBtn>
      );
    default:
      return (
        <PlayBtn onClick={handlePlayPause}>
          <PauseIcon className="w-7" />
        </PlayBtn>
      );
  }
}

import { Button } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useSingerContext } from "./SingerContext";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";

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
  const { songs, singer } = useSingerContext();

  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);

  const { handleSetSong } = useSetSong({ variant: "playlist" });
  const { handlePlayPause } = usePlayerAction();

  const handlePlaySingerSong = () => {
    const firstSong = songs[0];
    handleSetSong(firstSong.queue_id, songs);
  };

  // const handlePlayPause = () => {
  //   switch (playStatus) {
  //     case "playing":
  //       return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
  //     case "paused":
  //       return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
  //   }
  // };
  if (singer ? currentSongData?.song.queue_id.includes(singer.id) : false) {
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
  } else {
    return (
      <PlayBtn onClick={handlePlaySingerSong}>
        <PlayIcon className="w-7" />
      </PlayBtn>
    );
  }
}

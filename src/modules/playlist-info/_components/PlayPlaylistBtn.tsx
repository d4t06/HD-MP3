import { Button } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import useUpdateRecentPlaylist from "@/hooks/useUpdateRecentPlaylis";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { useThemeContext } from "@/stores";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

type PlayBtnProps = {
  children: ReactNode;
  text: string;
  onClick: () => void;
};

function PlayBtn({ onClick, children, text }: PlayBtnProps) {
  const { theme } = useThemeContext();
  const { playlistSongs } = useSelector(selectCurrentPlaylist);

  return (
    <Button
      onClick={onClick}
      disabled={!playlistSongs.length}
      size={"clear"}
      className={`rounded-full px-5 py-1 ${theme.content_bg}`}
    >
      {children}
      <span className="font-playwriteCU leading-[2.2]">{text}</span>
    </Button>
  );
}

export default function PlayPlaylistBtn() {
  // const dispatch = useDispatch();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const { handlePlayPause } = usePlayerAction();

  const { handleSetSong } = useSetSong({ variant: "playlist" });
  const { updatePlaylist } = useUpdateRecentPlaylist();

  const handlePlayPlaylist = () => {
    if (!currentPlaylist) return;

    const firstSong = playlistSongs[0];

    const isSetQueue = handleSetSong(firstSong.queue_id, playlistSongs);
    if (isSetQueue) updatePlaylist(currentPlaylist);
  };

  // const handlePlayPause = () => {
  //   switch (playStatus) {
  //     case "playing":
  //       return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
  //     case "paused":
  //       return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
  //   }
  // };

  // useEffect(() => {
  //   dispatch(setPlayStatus({ triggerPlayStatus: playStatus }));
  // }, [playStatus]);

  if (!currentPlaylist) return <></>;

  if (currentSongData?.song.queue_id.includes(currentPlaylist.id)) {
    switch (playStatus) {
      case "playing":
      case "waiting":
        return (
          <PlayBtn text="Pause" onClick={handlePlayPause}>
            <PauseIcon className="w-7 mr-1" />
          </PlayBtn>
        );
      case "loading":
      case "paused":
        return (
          <PlayBtn text="Continue" onClick={handlePlayPause}>
            <PlayIcon className="w-7 mr-1" />
          </PlayBtn>
        );
    }
  }

  return (
    <PlayBtn text="Play" onClick={handlePlayPlaylist}>
      <PlayIcon className="w-7 mr-1" />
    </PlayBtn>
  );
}

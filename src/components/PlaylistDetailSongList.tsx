import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";
import { SongListModal, Button, Modal, SongList } from "../components";
import CheckedBar from "./CheckedBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { setQueue } from "@/store/songQueueSlice";
import SongSelectProvider from "@/store/SongSelectContext";
import { ModalRef } from "./Modal";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import Skeleton, { SongItemSkeleton } from "./skeleton";

type Props = {
  variant: "admin-playlist" | "my-playlist" | "dashboard-playlist";
  loading: boolean;
};

const playlistSongSkeleton = (
  <>
    <div className="h-[30px] mb-[10px] flex items-center">
      <Skeleton className="h-[20px] w-[90px]" />
    </div>

    {SongItemSkeleton}
  </>
);

export default function PlaylistDetailSongList({ variant, loading }: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.toggle();

  const handleSetSong = (song: Song, index: number) => {
    if (!currentPlaylist) return;

    const newSongIn: SongIn = `playlist_${currentPlaylist.id}`;
    if (currentSong?.id !== song.id || currentSong.song_in !== newSongIn) {
      dispatch(
        setSong({
          ...song,
          currentIndex: index,
          song_in: newSongIn,
        })
      );

      // const shouldReplaceQueue =
      //   from.length > 1 ||
      //   from[0] != newSongIn ||
      //   playlistSongs.length !== queueSongs.length;
      const shouldReplaceQueue = true;
      if (shouldReplaceQueue) {
        dispatch(setQueue({ songs: playlistSongs }));
      }
    }
  };

  const renderCheckBar = useMemo(() => {
    if (!playlistSongs.length) return <></>;

    switch (variant) {
      case "admin-playlist":
        return (
          <CheckedBar variant={"admin-playlist"}>
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        );
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <CheckedBar variant={"my-playlist"}>
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        );
    }
  }, [currentPlaylist, playlistSongs]);

  const renderSongList = () => {
    switch (variant) {
      case "admin-playlist":
        return (
          <SongList
            variant="admin-playlist"
            songs={playlistSongs}
            handleSetSong={handleSetSong}
          />
        );
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <>
            <SongList
              variant={variant}
              songs={playlistSongs}
              handleSetSong={handleSetSong}
            />

            <div className="flex justify-center mt-[20px]">
              <Button
                onClick={() => modalRef.current?.toggle()}
                className={`${theme.content_bg} rounded-full`}
              >
                <PlusIcon className="w-7 mr-1" />
                <span className="font-playwriteCU leading-[2.2]">Add song</span>
              </Button>
            </div>
          </>
        );
    }
  };

  if (loading) return playlistSongSkeleton;

  return (
    <>
      <SongSelectProvider>
        {renderCheckBar}
        {renderSongList()}
      </SongSelectProvider>

      <Modal ref={modalRef} variant="animation">
        <SongSelectProvider>
          <SongListModal closeModal={closeModal} playlistSongs={playlistSongs} />
        </SongSelectProvider>
      </Modal>
    </>
  );
}

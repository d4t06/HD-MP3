import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../store";
import { SongListModal, Button, Modal, SongList } from "../components";
import CheckedBar from "./CheckedBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import SongSelectProvider from "@/store/SongSelectContext";
import { ModalRef } from "./Modal";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import useSetSong from "@/hooks/useSetSong";

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
  const { theme } = useTheme();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const modalRef = useRef<ModalRef>(null);

  const { handleSetSong } = useSetSong({ variant: "playlist" });

  const closeModal = () => modalRef.current?.toggle();

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, playlistSongs);
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
            handleSetSong={_handleSetSong}
          />
        );
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <>
            <SongList
              variant={variant}
              songs={playlistSongs}
              handleSetSong={_handleSetSong}
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
        <SongListModal closeModal={closeModal} playlistSongs={playlistSongs} />
      </Modal>
    </>
  );
}

import { useSelector } from "react-redux";
import { AddPlaylist, Empty, Modal, NotFound, PlaylistItem } from ".";
import { useThemeContext } from "../stores";
import { PlaylistSkeleton } from "./skeleton";
import { useRef } from "react";
import { ModalRef } from "./Modal";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

type Props = {
  className?: string;
  loading: boolean;
  variant: "others" | "my-music";
  playlists: Playlist[];
};

export default function PlaylistList({
  className = "",
  playlists,
  loading,
  variant,
}: Props) {
  const { theme } = useThemeContext();
  const { currentSongData } = useSelector(selectSongQueue);

  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.toggle();

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

  const renderModal = () => {
    switch (variant) {
      case "my-music":
        return <AddPlaylist close={closeModal} />;
    }
  };

  return (
    <>
      <div className={`flex flex-row flex-wrap -mx-[8px] ${className}`}>
        {loading && PlaylistSkeleton}
        {!loading && (
          <>
            {render()}

            {variant === "my-music" && (
              <>
                <div className={`${classes.playlistItem} mb-[25px]`}>
                  <Empty theme={theme} onClick={() => modalRef.current?.toggle()} />
                </div>

                <Modal variant="animation" ref={modalRef}>
                  {renderModal()}
                </Modal>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

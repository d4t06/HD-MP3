import { useSelector } from "react-redux";
import { AddPlaylist, Empty, Modal, PlaylistItem } from ".";
import { useThemeContext } from "../stores";
import { PlaylistSkeleton } from "./skeleton";
import { useMemo, useRef } from "react";
// import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";
import { ModalRef } from "./Modal";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useSongContext } from "@/stores";

type Props = {
  className?: string;
  loading: boolean;
  variant: "sys" | "my-song";
};

type ExtendProps = {
  className?: string;
  playlists: Playlist[];
  variant: "search-page";
};

export default function PlaylistList({ className = "", ...props }: Props | ExtendProps) {
  // stores
  const { theme } = useThemeContext();
  const { currentSongData } = useSelector(selectSongQueue);
  const { playlists, sysSongPlaylist } = useSongContext();

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  const loading = props.variant != "search-page" ? props.loading : false;
  const closeModal = () => modalRef.current?.toggle();

  // prettier-ignore
  const targetPlaylist = useMemo(() => {
    if (props.variant === "search-page") return props.playlists;

    return props.variant === "my-song"
      ? playlists
      : props.variant === "sys"
        ? sysSongPlaylist.playlists
        : [];
  }, [sysSongPlaylist, playlists]);

  const classes = {
    playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
  };

  const render = () => {
    if (!targetPlaylist.length) return <></>;

    return targetPlaylist.map((playlist, index) => {
      const active = currentSongData?.song.song_in.includes(playlist.id);

      switch (props.variant) {
        case "sys":
        case "search-page":
        case "my-song":
          return (
            <div key={index} className={classes.playlistItem}>
              <PlaylistItem active={active} data={playlist} />
            </div>
          );
      }
    });
  };

  const renderAddPlayingItem = () => {
    switch (props.variant) {
      case "my-song":
        return (
          <div className={`${classes.playlistItem} mb-[25px]`}>
            <Empty theme={theme} onClick={() => modalRef.current?.toggle()} />
          </div>
        );

      default:
        return <></>;
    }
  };

  const renderModal = () => {
    switch (props.variant) {
      case "my-song":
        return <AddPlaylist  close={closeModal} />;
    }
  };

  return (
    <>
      <div className={`flex flex-row flex-wrap -mx-[8px] ${className}`}>
        {loading && PlaylistSkeleton}
        {!loading && (
          <>
            {render()}
            {renderAddPlayingItem()}
          </>
        )}
      </div>
      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}

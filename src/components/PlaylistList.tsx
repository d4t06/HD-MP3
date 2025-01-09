import { useSelector } from "react-redux";
import { AddPlaylist, Empty, Modal, PlaylistItem } from ".";
import { useTheme } from "../store";
import { PlaylistSkeleton } from "./skeleton";
import { useMemo, useRef } from "react";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";
import { ModalRef } from "./Modal";
import { selectSongQueue } from "@/store/songQueueSlice";
import { useSongContext } from "@/store/SongsContext";

type Props = {
  className?: string;
  loading: boolean;
  variant: "sys" | "my-song" | "dashboard";
};

type ExtendProps = {
  className?: string;
  playlists: Playlist[];
  variant: "search-page";
};

export default function PlaylistList({ className = "", ...props }: Props | ExtendProps) {
  // store
  const { theme } = useTheme();
  const { currentSongData } = useSelector(selectSongQueue);
  const { playlists, sysSongPlaylist } = useSongContext();

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  const { addPlaylist, isFetching } = usePlaylistActions();
  const { addAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const loading = props.variant != "search-page" ? props.loading : false;
  const closeModal = () => modalRef.current?.toggle();

  // prettier-ignore
  const targetPlaylist = useMemo(() => {
    if (props.variant === "search-page") return props.playlists;

    return props.variant === "my-song" || props.variant === "dashboard"
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

        case "dashboard":
          return (
            <div key={index} className={classes.playlistItem}>
              <PlaylistItem
                active={active}
                data={playlist}
                link={`/dashboard/playlist/${playlist.id}`}
              />
            </div>
          );
      }
    });
  };

  const renderAddPlayingItem = () => {
    switch (props.variant) {
      case "my-song":
      case "dashboard":
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
        return (
          <AddPlaylist
            addPlaylist={addPlaylist}
            isFetching={isFetching}
            close={closeModal}
          />
        );

      case "dashboard":
        return (
          <AddPlaylist
            addPlaylist={addAdminPlaylist}
            isFetching={adminIsFetching}
            close={closeModal}
          />
        );
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

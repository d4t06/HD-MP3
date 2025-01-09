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

export default function PlaylistList({ loading, className, ...props }: Props) {
  // store
  const { theme } = useTheme();
  const { currentSongData } = useSelector(selectSongQueue);
  const { playlists, sysSongPlaylist } = useSongContext();

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  const { addPlaylist, isFetching } = usePlaylistActions();
  const { addAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const closeModal = () => modalRef.current?.toggle();

  // prettier-ignore
  const targetPlaylist = useMemo(() => 
   props.variant === 'my-song' || 
   props.variant === 'dashboard' ? playlists :
      props.variant === 'sys' ? sysSongPlaylist.playlists : []
  ,[sysSongPlaylist, playlists])

  const classes = {
    playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
  };

  const render = () => {
    if (!targetPlaylist.length) return <></>;

    return targetPlaylist.map((playlist, index) => {
      const active = currentSongData?.song.song_in.includes(playlist.id);

      switch (props.variant) {
        case "sys":
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

            {props.variant !== "sys" && (
              <div className={`${classes.playlistItem} mb-[25px]`}>
                <Empty theme={theme} onClick={() => modalRef.current?.toggle()} />
              </div>
            )}
          </>
        )}
      </div>
      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}

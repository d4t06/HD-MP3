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

// type ExtendProps = {
//   className?: string;
//   playlists: Playlist[];
//   variant: "search-page";
// };

export default function PlaylistList({
  className = "",
  playlists,
  loading,
  variant,
}: Props) {
  // stores
  const { theme } = useThemeContext();
  const { currentSongData } = useSelector(selectSongQueue);
  //   const { playlists, sysSongPlaylist } = useSongContext();

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  //   const loading = props.variant != "search-page" ? props.loading : false;
  const closeModal = () => modalRef.current?.toggle();

  // prettier-ignore
  //   const targetPlaylist = useMemo(() => {
  //     if (props.variant === "search-page") return props.playlists;

  //     return props.variant === "my-song"
  //       ? playlists
  //       : props.variant === "sys"
  //         ? sysSongPlaylist.playlists
  //         : [];
  //   }, [sysSongPlaylist, playlists]);

  const classes = {
    playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
  };

  const render = () => {
    if (!playlists.length) return <NotFound className="mx-auto" />;

    return playlists.map((playlist, index) => {
      const active = currentSongData?.song.song_in.includes(playlist.id);

      return (
        <div key={index} className={classes.playlistItem}>
          <PlaylistItem active={active} data={playlist} />
        </div>
      );
      // switch (props.variant) {
      //   case "sys":
      //   case "search-page":
      //   case "my-song":
      // }
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

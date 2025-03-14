import { ReactNode, useMemo, useRef, useState } from "react";
import { useSongContext, useThemeContext } from "@/stores";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useSongSelectContext } from "@/stores/SongSelectContext";
import { ModalRef, Button, Modal } from "@/components";
import useCheckBar from "./_hooks/useCheckBar";
import CheckedCta from "./_components/CheckedCta";

type Modal = "delete-selected-songs" | "remove-selects-songs";

type Props = {
  variant:
    | "home"
    | "my-playlist"
    | "my-songs"
    | "others-playlist"
    | "dashboard-songs"
    | "dashboard-playlist";
};

export default function CheckedBar({
  children,
  ...props
}: Props & {
  children?: ReactNode;
}) {
  // stores
  const { theme } = useThemeContext();
  const { isChecked, selectedSongs, selectAllSong, resetSelect } = useSongSelectContext();
  const { playlistSongs } = useSelector(selectCurrentPlaylist);
  const { uploadedSongs } = useSongContext();

  // state
  const [modal, setModal] = useState<Modal | "">("");

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  const {
    isFetching,
    addSongsToQueue,
    // deleteSelectedSong,
    // removeSelectedSongFromPlaylist,
  } = useCheckBar({ modalRef });

  // const _closeModal = () => {
  //   modalRef.current?.close();
  // };

  const openModal = (modal: Modal) => {
    setModal(modal);
    modalRef.current?.open();
  };

  const handleSelectUserSongs = () => {
    if (selectedSongs.length < uploadedSongs.length) selectAllSong(uploadedSongs);
    else resetSelect();
  };

  const handleSelectAllPlaylistSongs = () => {
    if (selectedSongs.length < playlistSongs.length) selectAllSong(playlistSongs);
    else resetSelect();
  };

  const classes = {
    title: "text-xl leading-[2.2] font-playwriteCU",
    outlineButton: `border-${theme.alpha} ${theme.side_bar_bg} space-x-1 text-sm`,
    icon: "w-5 mr-1",
  };

  const renderModal = useMemo(() => {
    if (!modal) return;

    switch (modal) {
      default : return <p>Nothing to show</p>
      // case "delete-selected-songs":
      //   return (
      //     <ConfirmModal
      //       loading={isFetching}
      //       label={`Delete ${selectedSongs.length} songs ?`}
      //       callback={deleteSelectedSong}
      //       close={closeModal}
      //     />
      //   );
      // case "remove-selects-songs":
      //   return (
      //     <ConfirmModal
      //       loading={isFetching}
      //       label={`Remove ${selectedSongs.length} songs ?`}
      //       callback={removeSelectedSongFromPlaylist}
      //       close={closeModal}
      //     />
      //   );
    }
  }, [modal, isFetching]);

  const content = useMemo(() => {
    switch (props.variant) {
      case "home":
        return (
          <>
            {!isChecked && <h3 className={`${classes.title} !mr-[14px]`}>Songs</h3>}

            {isChecked && (
              <CheckedCta variant={props.variant}>
                <p className="font-playwriteCU mr-1">{selectedSongs.length}</p>

                <Button
                  onClick={addSongsToQueue}
                  variant={"outline"}
                  size="small"
                  className={classes.outlineButton}
                >
                  <PlusIcon className={classes.icon} />
                  <span className="">Add to queue</span>
                </Button>
              </CheckedCta>
            )}
          </>
        );

      case "dashboard-songs":
        return (
          <>
            {!isChecked && children}
            {isChecked && (
              <CheckedCta variant={props.variant}>
                <div className="font-playwriteCU">{selectedSongs.length}</div>

                <Button
                  variant={"outline"}
                  size="small"
                  onClick={() => openModal("delete-selected-songs")}
                  className={classes.outlineButton}
                >
                  <TrashIcon className={classes.icon} />
                  <span className="hidden sm:block">Delete</span>
                </Button>
              </CheckedCta>
            )}
          </>
        );
      case "my-songs":
        return (
          <>
            {!isChecked && children}

            {isChecked && (
              <CheckedCta selectAll={handleSelectUserSongs} variant={props.variant}>
                <div className="font-playwriteCU !mr-[14px]">{selectedSongs.length}</div>

                <Button
                  variant={"outline"}
                  size="small"
                  onClick={addSongsToQueue}
                  className={classes.outlineButton}
                >
                  <PlusIcon className={classes.icon} />
                  <span className="">Add to queue</span>
                </Button>

                <Button
                  variant={"outline"}
                  size="small"
                  onClick={() => openModal("delete-selected-songs")}
                  className={classes.outlineButton}
                >
                  <TrashIcon className={classes.icon} />
                  <span className="hidden sm:block">Delete</span>
                </Button>
              </CheckedCta>
            )}
          </>
        );

      case "dashboard-playlist":
      case "my-playlist":
        return (
          <>
            {!isChecked && children}

            {isChecked && (
              <CheckedCta
                selectAll={handleSelectAllPlaylistSongs}
                variant={props.variant}
              >
                <p className="font-playwriteCU !mr-[14px]">{selectedSongs.length}</p>
                {props.variant === "my-playlist" && (
                  <Button
                    variant={"outline"}
                    size="small"
                    onClick={addSongsToQueue}
                    className={classes.outlineButton}
                  >
                    <PlusIcon className={classes.icon} />
                    Add to songs queue
                  </Button>
                )}

                <Button
                  variant={"outline"}
                  size="small"
                  onClick={() => openModal("remove-selects-songs")}
                  className={classes.outlineButton}
                >
                  <MinusIcon className={classes.icon} />
                  Remove
                </Button>
              </CheckedCta>
            )}
          </>
        );
      case "others-playlist":
        return (
          <>
            {!isChecked && <div className={`${classes.title} !mr-[14px]`}>Songs</div>}

            {isChecked && (
              <CheckedCta
                selectAll={handleSelectAllPlaylistSongs}
                variant={props.variant}
              >
                <p className="font-[500]">{selectedSongs.length}</p>

                <Button
                  variant={"outline"}
                  size="small"
                  onClick={addSongsToQueue}
                  className={classes.outlineButton}
                >
                  <PlusIcon className={classes.icon} />
                  Add to songs queue
                </Button>
              </CheckedCta>
            )}
          </>
        );
    }
  }, [isChecked, selectedSongs, props]);

  return (
    <>
      <div className="flex items-center space-x-2 h-[44px] mb-3">{content}</div>

      {
        <Modal ref={modalRef} variant="animation">
          {renderModal}
        </Modal>
      }
    </>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";
import { Button, ConfirmModal, Modal, PlaylistItem, Skeleton } from ".";
import {
  PauseIcon,
  PencilSquareIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EditPlaylist from "./modals/EditPlaylist";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { formatTime } from "../utils/appHelpers";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";
import { ModalRef } from "./Modal";
import useSetSong from "@/hooks/useSetSong";
import { selectSongQueue } from "@/store/songQueueSlice";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";

type Modal = "edit" | "delete";

type MyPlaylist = {
  variant: "my-playlist";
  loading: boolean;
};

type AdminPlaylist = {
  variant: "admin-playlist";
  loading: boolean;
};

type DashboardPlaylist = {
  variant: "dashboard-playlist";
  loading: boolean;
};

type Props = MyPlaylist | AdminPlaylist | DashboardPlaylist;

const PlayPlaylistBtn = ({
  onClick,
  children,
  disable,
  text,
}: {
  children: ReactNode;
  text: string;
  onClick: () => void;
  disable?: boolean;
}) => {
  const { theme } = useTheme();

  return (
    <Button
      onClick={onClick}
      size={"clear"}
      disabled={disable}
      className={`rounded-full px-5 py-1 ${theme.content_bg}`}
    >
      {children}
      <span className="font-playwriteCU leading-[2.2]">{text}</span>
    </Button>
  );
};

export default function PLaylistInfo({ loading, ...props }: Props) {
  const dispatch = useDispatch();

  // store
  const { theme, isOnMobile } = useTheme();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  // state
  const [modal, setModal] = useState<Modal | "">("");

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hooks
  const params = useParams();
  const { handleSetSong } = useSetSong({ variant: "playlist" });
  const { deletePlaylist, isFetching } = usePlaylistActions();
  const { deleteAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const playlistTime = useMemo(
    () => playlistSongs.reduce((prev, c) => prev + c.duration, 0),
    [playlistSongs]
  );

  const isActivePlaylist =
    playStatus === "playing" ||
    (playStatus === "waiting" &&
      currentSongData?.song.song_in === `playlist_${currentPlaylist?.id}`);

  const openModal = (modal: Modal) => {
    setModal(modal);
    modalRef.current?.toggle();
  };
  const closeModal = () => modalRef.current?.toggle();

  const handlePlayPlaylist = () => {
    if (currentSongData?.song.song_in.includes(params.name as string)) return;
    const firstSong = playlistSongs[0];
    handleSetSong(firstSong.queue_id, playlistSongs);
  };

  const handlePlayPause = () => {
    switch (playStatus) {
      case "playing":
        return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
      case "paused":
        return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
    }
  };

  const playlistInfoSkeleton = (
    <>
      <Skeleton className="h-[38px] mb-[6px] w-[200px]" />
      <Skeleton className="hidden md:block h-[16px] w-[60px]" />
      <Skeleton className="hidden md:block h-[16px] w-[200px]" />
    </>
  );

  const renderInfo = () => {
    if (loading) return playlistInfoSkeleton;

    return (
      <>
        <div className="text-xl leading-[2.2] font-playwriteCU">
          {currentPlaylist?.name}
        </div>
        {!isOnMobile && (
          <p className="text-lg leading-[1] font-[500]">{formatTime(playlistTime)}</p>
        )}
        {props.variant !== "dashboard-playlist" && (
          <p className="hidden md:block opacity-60 leading-[1]">
            created by {currentPlaylist?.by}
          </p>
        )}
      </>
    );
  };

  const renderPlayPlaylistBtn = () => {
    if (!currentPlaylist) return <></>;

    if (currentSongData?.song.song_in.includes(currentPlaylist.id)) {
      switch (playStatus) {
        case "playing":
        case "waiting":
          return (
            <PlayPlaylistBtn text="Pause" onClick={handlePlayPause}>
              <PauseIcon className="w-7 mr-1" />
            </PlayPlaylistBtn>
          );
        case "loading":
        case "paused":
          return (
            <PlayPlaylistBtn text="Continue Play" onClick={handlePlayPause}>
              <PlayIcon className="w-7 mr-1" />
            </PlayPlaylistBtn>
          );
      }
    }

    return (
      <PlayPlaylistBtn text="Play" onClick={handlePlayPlaylist}>
        <PlayIcon className="w-7 mr-1" />
      </PlayPlaylistBtn>
    );
  };

  const renderCta = () => {
    if (loading) return <></>;

    switch (props.variant) {
      case "my-playlist":
        return (
          <>
            {renderPlayPlaylistBtn()}
            <Button
              onClick={() => openModal("delete")}
              className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
              <TrashIcon className="w-[22px]" />
            </Button>

            <Button
              onClick={() => openModal("edit")}
              className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
              <PencilSquareIcon className="w-[22px]" />
            </Button>
          </>
        );
      case "dashboard-playlist":
        return (
          <>
            <Button
              onClick={() => openModal("delete")}
              className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
              <TrashIcon className="w-[22px]" />
            </Button>

            <Button
              onClick={() => openModal("edit")}
              className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
              <PencilSquareIcon className="w-[22px]" />
            </Button>
          </>
        );
      case "admin-playlist":
        return renderPlayPlaylistBtn();
    }
  };

  const renderModal = useMemo(() => {
    switch (modal) {
      case "":
        return <></>;
      case "edit":
        if (currentPlaylist)
          return <EditPlaylist close={closeModal} playlist={currentPlaylist} />;
        else return <></>;

      case "delete":
        if (props.variant === "my-playlist")
          return (
            <ConfirmModal
              loading={isFetching}
              label={"Delete playlist ?"}
              theme={theme}
              callback={deletePlaylist}
              close={closeModal}
            />
          );
        if (props.variant === "dashboard-playlist")
          return (
            <ConfirmModal
              loading={adminIsFetching}
              label={"Delete playlist ?"}
              theme={theme}
              callback={deleteAdminPlaylist}
              close={closeModal}
            />
          );
    }
  }, [modal, isFetching, adminIsFetching]);

  const classes = {
    container:
      "w-full space-y-[12px] md:space-y-0 md:space-x-[12px] flex flex-col md:flex-row",
    playlistInfoContainer: `flex flex-col gap-[12px] md:justify-between`,
    infoTop: "flex justify-center items-center gap-[8px] md:flex-col md:items-start",
    countSongText: "text-[14px]] font-semibold opacity-[.6] leading-[1]",
    ctaContainer: `flex justify-center space-x-[12px] md:justify-start`,
  };

  return (
    <>
      <div className={classes.container}>
        {/* image */}
        <div className="w-full px-10 md:w-1/4 md:px-0">
          {loading ? (
            <Skeleton className="pt-[100%] rounded-[8px]" />
          ) : (
            currentPlaylist && (
              <PlaylistItem data={currentPlaylist} active={isActivePlaylist} inDetail />
            )
          )}
        </div>

        {/* desktop playlist info */}
        <div className={classes.playlistInfoContainer}>
          <div className={classes.infoTop}>{renderInfo()}</div>

          {/* cta */}
          <div className={`${classes.ctaContainer} `}>{renderCta()}</div>
        </div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {renderModal}
      </Modal>
    </>
  );
}

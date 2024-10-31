import { useSelector } from "react-redux";
import { useTheme } from "../store";
import { Button, ConfirmModal, Modal, PlaylistItem, Skeleton } from ".";
import { PencilSquareIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EditPlaylist from "./modals/EditPlaylist";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { formatTime } from "../utils/appHelpers";
// import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
// import { selectSongQueue, setCurrentQueueId, setQueue } from "@/store/songQueueSlice";
import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";
import { ModalRef } from "./Modal";
import useSetSong from "@/hooks/useSetSong";
import { selectSongQueue } from "@/store/songQueueSlice";
// import useCurrentSong from "@/hooks/useCurrentSong";

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

export default function PLaylistInfo({ loading, ...props }: Props) {
  // store
  // const dispatch = useDispatch();
  const { theme, isOnMobile } = useTheme();
  // const { currentSong } = useSelector(selectCurrentSong);
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
  const { currentSongData} = useSelector(selectSongQueue);

  // state
  const [modal, setModal] = useState<Modal | "">("");

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hooks
  const params = useParams();
  // const { songData } = useCurrentSong();
  const { handleSetSong } = useSetSong();
  const { deletePlaylist, isFetching } = usePlaylistActions();
  const { deleteAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const playlistTime = useMemo(
    () => playlistSongs.reduce((prev, c) => prev + c.duration, 0),
    [playlistSongs]
  );

  const openModal = (modal: Modal) => {
    setModal(modal);
    modalRef.current?.toggle();
  };
  const closeModal = () => modalRef.current?.toggle();

  // const handleSetSong = (song: Song, index: number) => {
  //   if (!currentPlaylist) return;

  //   // case user play user songs then play playlist song
  //   const newSongIn: SongIn = `playlist_${currentPlaylist.id}`;
  //   if (currentSong?.id !== song.id || currentSong?.song_in !== newSongIn) {
  //     dispatch(
  //       setSong({
  //         ...song,
  //         currentIndex: index,
  //         song_in: newSongIn,
  //       })
  //     );

  //     if (currentSong?.song_in !== newSongIn) {
  //       dispatch(setQueue({ songs: playlistSongs }));
  //       console.log("setActuallySongs when playlist list");
  //     }
  //   }
  // };

  // const handleSetSong = (queueId: string) => {
  //   // song in playlist and song in user are two difference case
  //   if (currentQueueId !== queueId) {
  //     dispatch(setCurrentQueueId(queueId));

  //     const currentQueueIdList = queueSongs.map((s) => s.id);
  //     const isDiff = playlistSongs.find((s) => !currentQueueIdList.includes(s.queue_id));
  //     if (isDiff) {
  //       console.log("set queue");

  //       dispatch(setQueue({ songs: playlistSongs }));
  //     }
  //   }
  // };

  const handlePlayPlaylist = () => {
    if (currentSongData?.song.song_in.includes(params.name as string)) return;
    const firstSong = playlistSongs[0];
    handleSetSong(firstSong.queue_id, playlistSongs);
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

  const renderCta = () => {
    if (loading) return <></>;

    switch (props.variant) {
      case "my-playlist":
        return (
          <>
            <Button
              onClick={handlePlayPlaylist}
              size={"clear"}
              className={`rounded-full px-[20px] py-1 ${theme.content_bg} ${
                !playlistSongs.length && "disable"
              }`}
            >
              <PlayIcon className="w-[22px]" />
              <span className="font-playwriteCU leading-[2.2]">Play</span>
            </Button>
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
        return (
          <Button
            onClick={handlePlayPlaylist}
            size={"clear"}
            className={`rounded-full px-[20px] space-x-1 py-1 ${theme.content_bg} ${
              !playlistSongs.length && "disable"
            }`}
          >
            <PlayIcon className="w-7" />
            <span className="font-playwriteCU leading-[2.2]">Play</span>
          </Button>
        );
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
        <div className="w-full px-[20px] md:w-1/4 md:px-0">
          {loading ? (
            <Skeleton className="pt-[100%] rounded-[8px]" />
          ) : (
            currentPlaylist && (
              <PlaylistItem
                data={currentPlaylist}
                active={currentSongData?.song.song_in === `playlist_${currentPlaylist?.id}`}
                inDetail
              />
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

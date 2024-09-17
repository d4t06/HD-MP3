import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";
import { Button, ConfirmModal, Modal, PlaylistItem, Skeleton } from ".";
import { PencilSquareIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EditPlaylist from "./modals/EditPlaylist";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { formatTime } from "../utils/appHelpers";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { setQueue } from "@/store/songQueueSlice";
import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";

type Modal = "edit" | "delete";

type MyPlaylist = {
  type: "my-playlist";
  loading: boolean;
};

type AdminPlaylist = {
  type: "admin-playlist";
  loading: boolean;
};

type DashboardPlaylist = {
  type: "dashboard-playlist";
  loading: boolean;
};

type Props = MyPlaylist | AdminPlaylist | DashboardPlaylist;

export default function PLaylistInfo({ loading, type }: Props) {
  // store
  const dispatch = useDispatch();
  const { theme, isOnMobile } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  // state
  const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

  // hooks
  const params = useParams();
  const { deletePlaylist, isFetching } = usePlaylistActions();
  const { deleteAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const playlistTime = useMemo(
    () => playlistSongs.reduce((prev, c) => prev + c.duration, 0),
    [playlistSongs]
  );

  const closeModal = () => setIsOpenModal("");

  const handleSetSong = (song: Song, index: number) => {
    // case user play user songs then play playlist song
    const newSongIn: SongIn = `playlist_${currentPlaylist.id}`;
    if (currentSong.id !== song.id || currentSong.song_in !== newSongIn) {
      dispatch(
        setSong({
          ...song,
          currentIndex: index,
          song_in: newSongIn,
        })
      );

      if (currentSong.song_in !== newSongIn) {
        dispatch(setQueue({ songs: playlistSongs }));
        console.log("setActuallySongs when playlist list");
      }
    }
  };

  const handlePlayPlaylist = () => {
    const firstSong = playlistSongs[0];

    if (currentSong.song_in.includes(params.name as string)) return;
    handleSetSong(firstSong, 0);
  };

  const playlistInfoSkeleton = (
    <>
      <Skeleton className="h-[38px] mb-[6px] w-[200px]" />
      <Skeleton className="hidden md:block h-[16px] w-[60px]" />
      <Skeleton className="hidden md:block h-[16px] w-[200px]" />
    </>
  );

  const renderInfo = useMemo(() => {
    if (loading) return playlistInfoSkeleton;

    return (
      <>
        <div className="text-xl leading-[2.2] font-playwriteCU">
          {currentPlaylist.name}
        </div>
        {!isOnMobile && (
          <p className="text-lg leading-[1] font-[500]">{formatTime(playlistTime)}</p>
        )}
        <p className="hidden md:block opacity-60 leading-[1]">
          created by {currentPlaylist.by}
        </p>
      </>
    );
  }, [loading, currentPlaylist]);

  const renderCta = useMemo(() => {
    if (loading) return <></>;

    switch (type) {
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <>
            <Button
              onClick={handlePlayPlaylist}
              className={`rounded-full px-[20px] py-[6px] ${theme.content_bg} ${
                !currentPlaylist.song_ids.length && "opacity-60 pointer-events-none"
              }`}
            >
              <PlayIcon className="w-[22px]" />
              <span className="font-playwriteCU">Play</span>
            </Button>
            <Button
              onClick={() => setIsOpenModal("delete")}
              className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
              <TrashIcon className="w-[22px]" />
            </Button>

            <Button
              onClick={() => setIsOpenModal("edit")}
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
            className={`rounded-full px-[20px] space-x-1 py-[6px] ${theme.content_bg} ${
              !currentPlaylist.song_ids.length && "opacity-60 pointer-events-none"
            }`}
          >
            <PlayIcon className="w-[22px]" />
            <span className="font-playwriteCU">Play</span>
          </Button>
        );
    }
  }, [loading, playlistSongs]);

  const renderModal = useMemo(() => {
    switch (isOpenModal) {
      case "":
        return <></>;
      case "edit":
        return <EditPlaylist close={closeModal} playlist={currentPlaylist} />;

      case "delete":
        if (type === "my-playlist")
          return (
            <ConfirmModal
              loading={isFetching}
              label={"Delete playlist ?"}
              theme={theme}
              callback={deletePlaylist}
              close={closeModal}
            />
          );
        if (type === "dashboard-playlist")
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
  }, [isOpenModal, isFetching, adminIsFetching]);

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
            <PlaylistItem
              data={currentPlaylist}
              active={currentSong.song_in === `playlist_${currentPlaylist.id}`}
              inDetail
              theme={theme}
            />
          )}
        </div>

        {/* desktop playlist info */}
        <div className={classes.playlistInfoContainer}>
          <div className={classes.infoTop}>{renderInfo}</div>

          {/* cta */}
          <div className={`${classes.ctaContainer} `}>{renderCta}</div>
        </div>
      </div>

      {!!isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
    </>
  );
}

import { useMemo, useRef, useState } from "react";

import {
  ArrowPathIcon,
  HeartIcon,
  MusicalNoteIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { formatTime } from "../utils/appHelpers";

import { useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import {
  PopupWrapper,
  Image,
  Modal,
  SongItemEditForm,
  ConfirmModal,
  PlaylistListModal,
} from "../components";

import SongMenu from "./SongMenu";
import { useSongItemActions } from "../hooks";
import { useDispatch } from "react-redux";
import { removeSongFromQueue } from "@/store/songQueueSlice";
import { Bars3Icon, CheckIcon } from "@heroicons/react/20/solid";
import { useSongSelectContext } from "@/store/SongSelectContext";
import { ModalRef } from "./Modal";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "./MyPopup";
import MyTooltip from "./MyTooltip";

type Props = {
  className?: string;
  active?: boolean;
  onClick: () => void;
  song: Song;
  index?: number;
  variant:
    | "home"
    | "my-songs"
    | "my-playlist"
    | "admin-playlist"
    | "queue"
    | "favorite"
    | "dashboard-songs"
    | "dashboard-playlist"
    | "uploading";
};

export type SongItemModal = "edit" | "delete" | "add-to-playlist";

function SongItem({ song, onClick, active = true, index, className, ...props }: Props) {
  // store
  const dispatch = useDispatch();
  const { theme, isOnMobile } = useTheme();
  const { user } = useAuthStore();
  const { isChecked, selectedSongs, selectSong } = useSongSelectContext();
  const { userPlaylists } = useSongsStore();

  // state
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [modal, setModal] = useState<SongItemModal | "">("");

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hooks
  const { setErrorToast } = useToast();

  const closeModal = () => modalRef.current?.toggle();
  const closeMenu = () => setIsOpenPopup(false);

  const {
    handleDeleteSong,
    handleAddSongToPlaylistMobile,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    loading: actionLoading,
  } = useSongItemActions({ song, closeModal, setIsOpenPopup });

  const handleOpenModal = (modal: SongItemModal) => {
    setModal(modal);
    closeMenu();

    modalRef.current?.toggle();
  };

  const isSelected = useMemo(() => {
    if (!selectedSongs) return false;
    return selectedSongs.indexOf(song) != -1;
  }, [selectedSongs]);

  const isLiked = useMemo(
    () => (user ? user.like_song_ids.includes(song.id) : false),
    [user?.like_song_ids, song]
  );

  const handleRemoveFromQueue = () => {
    if (index === undefined) return;
    dispatch(removeSongFromQueue({ index }));
    // setSuccessToast({ message: `'${song.name}' removed from queue` });
  };

  const handleLikeSong = async () => {
    if (!user) return;

    try {
      // setLoading(true);
      // const newUserLikeSongIds = [...user.like_song_ids];
      // const index = newUserLikeSongIds.indexOf(song.id);
      // if (index === -1) {
      //    newUserLikeSongIds.push(song.id);
      //    if (queueSongs) {
      //       const index = queueSongs.find((s) => s.id === song.id);
      //       if (!index) {
      //          console.log("like songs, add to queue");
      //          handleAddToQueue();
      //       }
      //    }
      // } else {
      //    newUserLikeSongIds.splice(index, 1);
      //    if (queueSongs) {
      //       const index = queueSongs.find((s) => s.id === song.id);
      //       if (index) {
      //          console.log("unlike songs remove from queue");
      //          // dispatch(removeSongFromQueue({ song }));
      //          // handleRemoveFromQueue
      //       }
      //    }
      // }
      //  setUser();
      //  await mySetDoc({
      //     collection: "users",
      //     data: { like_song_ids: newUserLikeSongIds } as Partial<User>,
      //     id: user.email,
      //  });
    } catch (error) {
      console.log(error);
      setErrorToast("Error when liked song");
    } finally {
      setLoading(false);
    }
  };

  //selectedSong
  const handleSelect = (song: Song) => {
    if (isChecked === undefined) return;
    selectSong(song);
  };

  // define style
  const classes = {
    button: `${theme.content_hover_bg} p-[8px] rounded-full`,
    songListButton: `p-1 mr-1 text-[inherit]`,
    itemContainer: `group/container flex flex-row rounded justify-between px-[10px] py-[10px] w-full border-b border-${theme.alpha} last:border-none p-[0px]`,
    imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
      props.variant === "queue" ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
    }`,
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
    ctaWrapper: "flex items-center justify-end flex-shrink-0",
    menuBtnWrapper: "w-[50px] flex justify-center relative",
  };

  const renderCheckBox = () => {
    switch (props.variant) {
      case "queue":
        return <></>;
      case "uploading":
        return (
          <button className={`${classes.songListButton}`}>
            <MusicalNoteIcon className="w-[18px]" />
          </button>
        );
      default:
        if (isOnMobile)
          return (
            <button
              onClick={() => handleSelect(song)}
              className={`${classes.songListButton} text-[inherit]`}
            >
              {!isSelected ? (
                <StopIcon className="w-[18px]" />
              ) : (
                <CheckIcon className="w-[18px]" />
              )}
            </button>
          );
        return (
          <>
            <button
              onClick={() => handleSelect(song)}
              className={`${classes.songListButton} ${
                !isSelected && "hidden"
              } group-hover/main:block`}
            >
              {!isSelected ? (
                <StopIcon className="w-[18px]" />
              ) : (
                <CheckIcon className="w-[18px]" />
              )}
            </button>
            <button
              className={`${classes.songListButton} ${
                isSelected && "hidden"
              } group-hover/main:hidden group-hover/main:mr-[0px]`}
            >
              <MusicalNoteIcon className="w-[18px]" />
            </button>
          </>
        );
    }
  };

  const imageOverlay = useMemo(() => {
    switch (props.variant) {
      case "uploading":
        return <></>;
      default:
        return (
          <div
            className={` ${classes.overlay} 
               ${!active ? "hidden sm:group-hover/main:flex" : ""}`}
          >
            {active ? (
              <img src={playingIcon} alt="" className="h-[18px] w-[18px]" />
            ) : (
              <div
                onClick={onClick}
                className="cursor-pointer w-full h-full flex items-center justify-center"
              >
                <PlayIcon className="w-[24px] text-white" />
              </div>
            )}
          </div>
        );
    }
  }, [active, onClick]);

  const leftElement = (
    <>
      {renderCheckBox()}

      <div
        className="flex-grow flex"
        onClick={isOnMobile && props.variant !== "uploading" ? onClick : () => {}}
      >
        {/* song image */}
        <div className={`${classes.imageFrame}`}>
          <Image src={song.image_url} blurHashEncode={song.blurhash_encode} />

          {imageOverlay}
        </div>

        {/* song name and singer */}
        <div className={`ml-[10px]  ${props.variant === "queue" ? "" : ""}`}>
          <h5
            className={`line-clamp-1  leading-[1.2] font-medium overflow-hidden ${
              props.variant === "queue" ? "text-sm" : "text-lg"
            }`}
          >
            {song.name}
          </h5>
          <p
            className={`opacity-[.7] line-clamp-1 
               ${props.variant === "queue" ? "text-sm" : ""}
                       `}
          >
            {song.singer}
          </p>
        </div>
      </div>
    </>
  );

  const left = () => {
    switch (props.variant) {
      case "uploading":
        return <div className="opacity-[.7]">{leftElement}</div>;
      case "queue":
        return leftElement;
      default:
        return <div className="flex flex-grow">{leftElement}</div>;
    }
  };

  const renderHeartIcon = useMemo(() => {
    if (loading) return <ArrowPathIcon className="w-[20px] animate-spin" />;

    switch (props.variant) {
      case "dashboard-songs":
      case "dashboard-playlist":
        return <></>;
      default:
        if (!!user)
          return (
            <button
              onClick={handleLikeSong}
              className={`${classes.button} max-[549px]:!bg-transparent group`}
            >
              <HeartIconSolid
                className={`w-[20px]  ${
                  isLiked
                    ? `${theme.content_text} block group-hover:hidden`
                    : `text-white hidden group-hover:block`
                }`}
              />
              <HeartIcon
                className={`w-[20px] ${
                  isLiked ? "hidden group-hover:block" : "block group-hover:hidden"
                }`}
              />
            </button>
          );
        return <></>;
    }
  }, [handleLikeSong, isLiked]);

  const renderMenu = useMemo(() => {
    switch (props.variant) {
      case "home":
      case "dashboard-songs":
        return (
          <SongMenu
            closeMenu={closeMenu}
            variant={props.variant}
            handleAddSongToPlaylist={handleAddSongToPlaylist}
            handleOpenModal={handleOpenModal}
            song={song}
          />
        );

      case "my-songs":
      case "favorite":
        return (
          <SongMenu
            closeMenu={closeMenu}
            variant="my-songs"
            handleAddSongToPlaylist={handleAddSongToPlaylist}
            handleOpenModal={handleOpenModal}
            song={song}
          />
        );

      case "my-playlist":
      case "admin-playlist":
      case "dashboard-playlist":
        return (
          <SongMenu
            closeMenu={closeMenu}
            variant="playlist"
            handleRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
            handleOpenModal={handleOpenModal}
            song={song}
          />
        );
      case "queue":
        return (
          <SongMenu
            closeMenu={closeMenu}
            handleRemoveSongFromQueue={handleRemoveFromQueue}
            variant="queue"
            handleOpenModal={handleOpenModal}
            song={song}
          />
        );
      default:
        return <></>;
    }
  }, [props.variant, song, isOpenPopup]);

  const renderModal = useMemo(() => {
    switch (modal) {
      case "":
        return <></>;
      case "edit":
        return <SongItemEditForm close={closeModal} song={song} />;
      case "delete":
        return (
          <ConfirmModal
            loading={actionLoading}
            label={`Delete '${song.name}' ?`}
            desc={"This action cannot be undone"}
            theme={theme}
            callback={handleDeleteSong}
            close={closeModal}
          />
        );
      case "add-to-playlist":
        return (
          <PlaylistListModal
            loading={actionLoading}
            handleAddSongToPlaylist={handleAddSongToPlaylistMobile}
            closeModal={closeModal}
            song={song}
            userPlaylists={userPlaylists}
          />
        );
    }
  }, [modal, actionLoading]);

  const right = () => {
    switch (props.variant) {
      case "uploading":
        return (
          <div className="flex items-center">
            <span>
              <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
            </span>
            <p className="text-[14px]">In process...</p>
          </div>
        );

      default:
        return (
          <div className={classes.ctaWrapper}>
            {renderHeartIcon}

            <div className={classes.menuBtnWrapper}>
              {/* <Popover
                isOpenFromParent={isOpenPopup}
                setIsOpenFromParent={setIsOpenPopup}
                placement={props.variant === "queue" ? "bottom-end" : "left"}
              >
                <PopoverTrigger asChild>
                  <button
                    className={`block group-hover/main:block ${classes.button} ${
                      isOpenPopup || props.variant === "queue"
                        ? `md:block`
                        : "md:hidden max-[549px]:!bg-transparent"
                    }`}
                  >
                    <Bars3Icon className="w-[20px]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopupWrapper
                    className={`${actionLoading ? "overflow-hidden relative" : ""}`}
                    variant={"thin"}
                    color="sidebar"
                    theme={theme}
                  >
                    {renderMenu}

                    {actionLoading && (
                      <div className={classes.overlay}>
                        <div
                          className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
                        ></div>
                      </div>
                    )}
                  </PopupWrapper>
                </PopoverContent>
              </Popover> */}

              <MyPopup appendOnPortal>
                <MyPopupTrigger>
                  <MyTooltip isWrapped content="Menu">
                    <button
                      className={`block group-hover/main:block ${classes.button} ${
                        isOpenPopup || props.variant === "queue"
                          ? `md:block`
                          : "md:hidden max-[549px]:!bg-transparent"
                      }`}
                    >
                      <Bars3Icon className="w-[20px]" />
                    </button>
                  </MyTooltip>
                </MyPopupTrigger>
                <MyPopupContent appendTo="portal">
                  <PopupWrapper
                    className={`${actionLoading ? "overflow-hidden relative" : ""}`}
                    p={2}
                    color="sidebar"
                    theme={theme}
                  >
                    {renderMenu}

                    {actionLoading && (
                      <div className={classes.overlay}>
                        <div
                          className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
                        ></div>
                      </div>
                    )}
                  </PopupWrapper>
                </MyPopupContent>
              </MyPopup>

              <span
                className={`text-sm font-[500] hidden  group-hover/main:hidden ${
                  isOpenPopup || props.variant === "queue" ? "hidden" : "md:block"
                }`}
              >
                {formatTime(song.duration)}
              </span>
            </div>
          </div>
        );
    }
  };

  const renderContainer = () => {
    switch (props.variant) {
      case "uploading":
        return (
          <div className={`${classes.itemContainer} ${className || ""} `}>
            {left()}
            {right()}
          </div>
        );
      case "queue":
        return (
          <div
            className={`${classes.itemContainer} group/main py-[6px] ${
              active ? `${theme.content_bg} text-white` : `hover:bg-${theme.alpha}`
            }`}
          >
            {left()}
            {right()}
          </div>
        );
      default:
        return (
          <div
            className={`${classes.itemContainer} ${className || ""} group/main ${
              active || isSelected ? `bg-${theme.alpha}` : `hover:bg-${theme.alpha}`
            }`}
          >
            {left()}
            {right()}
          </div>
        );
    }
  };

  console.log('song item render')

  return (
    <>
      {renderContainer()}
      <Modal ref={modalRef} variant="animation">
        {renderModal}
      </Modal>
    </>
  );
}

export default SongItem;

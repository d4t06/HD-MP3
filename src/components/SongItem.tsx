import { useMemo, useState } from "react";

import {
   ArrowPathIcon,
   HeartIcon,
   MusicalNoteIcon,
   StopIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { handleTimeText } from "../utils/appHelpers";

import { useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import {
   PopupWrapper,
   Image,
   Modal,
   SongItemEditForm,
   ConfirmModal,
   PlaylistList,
} from "../components";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import SongMenu from "./SongMenu";
import { useSongItemActions } from "../hooks";
import { useDispatch } from "react-redux";
import { removeSongFromQueue } from "@/store/songQueueSlice";
import { Bars3Icon, CheckIcon } from "@heroicons/react/20/solid";
import { useSongSelectContext } from "@/store/SongSelectContext";

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
   const [isOpenModal, setIsOpenModal] = useState<SongItemModal | "">("");

   // hooks
   const { setErrorToast } = useToast();

   const closeModal = () => setIsOpenModal("");

   const {
      handleDeleteSong,
      handleAddSongToPlaylistMobile,
      handleAddSongToPlaylist,
      handleRemoveSongFromPlaylist,
      loading: actionLoading,
   } = useSongItemActions({ song, closeModal, setIsOpenPopup });

   const handleOpenModal = (modal: SongItemModal) => {
      setIsOpenModal(modal);
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
         setErrorToast({ message: "Error when liked song" });
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
      songListButton: `mr-[10px] text-[inherit]`,
      itemContainer: `group/container flex flex-row rounded justify-between px-[10px] py-[10px] w-full border-b 
    border-${theme.alpha} last:border-none p-[0px]`,

      imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
         props.variant === "queue" ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
      }`,
      overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
      ctaWrapper: "flex items-center justify-end min-w-[86px] flex-shrink-0",
      menuBtnWrapper: "w-[50px] flex justify-center ",
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
                     className={`${classes.songListButton} ${!isSelected && "hidden"} group-hover/main:block`}
                  >
                     {!isSelected ? (
                        <StopIcon className="w-[18px]" />
                     ) : (
                        <CheckIcon className="w-[18px]" />
                     )}
                  </button>
                  <button
                     className={`${classes.songListButton} ${isSelected && "hidden"} group-hover/main:hidden group-hover/main:mr-[0px]`}
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
                  className={`${classes.overlay} 
               ${!active ? "hidden group-hover/main:flex" : ""}`}
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
      <div className={`flex flex-row flex-grow props`}>
         {renderCheckBox()}

         <div
            className="flex flex-grow "
            onClick={isOnMobile && props.variant !== "uploading" ? onClick : () => {}}
         >
            {/* song image */}
            <div className={`${classes.imageFrame}`}>
               <Image src={song.image_url} blurHashEncode={song.blurhash_encode} />

               {imageOverlay}
            </div>

            {/* song name and singer */}
            <div
               className={`ml-[10px] ${props.variant === "queue" ? "max-w-[96px]" : ""}`}
            >
               <h5
                  className={`font-[500] line-clamp-1 overflow-hidden ${
                     props.variant === "queue" ? "text-[13px]" : ""
                  }`}
               >
                  {song.name}
               </h5>
               <p className="text-[14px] opacity-[.5] line-clamp-1">{song.singer}</p>
            </div>
         </div>
      </div>
   );

   const left = () => {
      switch (props.variant) {
         case "uploading":
            return <div className="opacity-[.6]">{leftElement}</div>;
         default:
            return leftElement;
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
                           isLiked
                              ? "hidden group-hover:block"
                              : "block group-hover:hidden"
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
                  variant="playlist"
                  handleRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
                  handleOpenModal={handleOpenModal}
                  song={song}
               />
            );
         case "queue":
            return (
               <SongMenu
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
      switch (isOpenModal) {
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
               <PlaylistList
                  loading={actionLoading}
                  handleAddSongToPlaylist={handleAddSongToPlaylistMobile}
                  close={close}
                  song={song}
                  userPlaylists={userPlaylists}
               />
            );
      }
   }, [isOpenModal, actionLoading]);

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
                     <Popover
                        isOpenFromParent={isOpenPopup}
                        setIsOpenFromParent={setIsOpenPopup}
                        placement={props.variant === "queue" ? "bottom-end" : "left"}
                     >
                        <PopoverTrigger asChild>
                           <button
                              className={`block group-hover/main:block ${
                                 classes.button
                              } ${
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
                              className={`${
                                 actionLoading ? "overflow-hidden relative" : ""
                              }`}
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
                     </Popover>
                     <span
                        className={`text-[12px] font-[500] hidden  group-hover/main:hidden ${
                           isOpenPopup || props.variant === "queue"
                              ? "hidden"
                              : "md:block"
                        }`}
                     >
                        {handleTimeText(song.duration)}
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
                  className={`${classes.itemContainer} ${className || ""} 
               group/main ${
                  active || isSelected ? `bg-${theme.alpha}` : `hover:bg-${theme.alpha}`
               }
               `}
               >
                  {left()}
                  {right()}
               </div>
            );
      }
   };

   return (
      <>
         {renderContainer()}
         {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

export default SongItem;

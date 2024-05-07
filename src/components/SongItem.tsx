import { memo, useMemo, useState } from "react";

import Button from "./ui/Button";
import {
   ArrowPathIcon,
   Bars3Icon,
   CheckIcon,
   StopIcon,
   HeartIcon,
   PauseCircleIcon,
   MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { handleTimeText, selectSongs } from "../utils/appHelpers";

import {
   useActuallySongsStore,
   useAuthStore,
   useSongsStore,
   useTheme,
   useToast,
} from "../store";
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
import { mySetDoc } from "../utils/firebaseHelpers";
import { useSongListContext } from "../store/SongListContext";
import { useSongItemActions } from "../hooks";

type Base = {
   className?: string;
   handleSetSong: (song: Song, index: number) => void;
   activeExtend: boolean;
   song: Song;
};

type Home = Base & {
   location: "home";
};

type MySong = Base & {
   location: "my-songs";
};

type Favorite = Base & {
   location: "favorite";
};

type Queue = Base & {
   location: "queue";
};

type MyPlaylist = Base & {
   location: "my-playlist";
};

type AdminPlaylist = Base & {
   location: "admin-playlist";
};

type Uploading = {
   song: Song;
   location: "uploading";
};

// interface Props {
//    data: Song;
//    className?: string;
//    active: boolean;
//    onClick?: () => void;
//    theme: ThemeType & { alpha: string };
//    inProcess?: boolean;
//    inQueue?: boolean;
//    admin?: boolean;
// }

type Props =
   | Home
   | MySong
   | MyPlaylist
   | Queue
   | Playlist
   | Favorite
   | AdminPlaylist
   | Uploading;

export type SongItemModal = "edit" | "delete" | "add-to-playlist";

function SongItem({}: // className,
// data,
// active,
// onClick,
// inProcess,
// admin,
// inQueue,
Props) {
   // store
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { actuallySongs, addToQueue, removeFromQueue } = useActuallySongsStore();
   const { isChecked, selectedSongs, setIsChecked, setSelectedSongs } =
      useSongListContext();
   const { userPlaylists } = useSongsStore();

   // state
   const [loading, setLoading] = useState<boolean>(false);
   const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
   const [isOpenModal, setIsOpenModal] = useState<SongItemModal | "">("");

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();

   const closeModal = () => setIsOpenModal("");

   const {
      handleDeleteSong,
      handleAddSongToPlaylistMobile,
      handleAddSongToPlaylist,
      handleRemoveSongFromPlaylist,
      loading: actionLoading,
   } = useSongItemActions({ song: data, admin, closeModal, setIsOpenPopup });

   const handleOpenModal = (modal: SongItemModal) => {
      setIsOpenModal(modal);
   };

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   const isSelected = useMemo(() => {
      if (!selectedSongs) return false;
      return selectedSongs?.indexOf(data) != -1;
   }, [selectedSongs]);

   const isLiked = useMemo(
      () => (user ? user.like_song_ids.includes(data.id) : false),
      [user?.like_song_ids, data]
   );

   const handleAddToQueue = () => {
      addToQueue(data);
      setSuccessToast({ message: "Song add to queue" });
   };

   const handleLikeSong = async () => {
      if (admin || !user) return;

      try {
         setLoading(true);

         const newUserLikeSongIds = [...user.like_song_ids];
         const index = newUserLikeSongIds.indexOf(data.id);

         if (index === -1) {
            newUserLikeSongIds.push(data.id);
            if (actuallySongs) {
               const index = actuallySongs.find((s) => s.id === data.id);
               if (!index) {
                  console.log("like songs, add to queue");

                  handleAddToQueue();
               }
            }
         } else {
            newUserLikeSongIds.splice(index, 1);
            if (actuallySongs) {
               const index = actuallySongs.find((s) => s.id === data.id);
               if (index) {
                  console.log("unlike songs remove from queue");

                  removeFromQueue(data);
               }
            }
         }

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
      if (!setSelectedSongs || !selectedSongs || !setIsChecked) {
         setErrorToast({ message: "Selected lack of props" });
         return;
      }
      if (isChecked === undefined) return;
      selectSongs(song, isChecked, setIsChecked, selectedSongs, setSelectedSongs);
   };

   // define style
   const classes = {
      button: `${theme.content_hover_bg} p-[8px] rounded-full`,
      songListButton: `mr-[10px] text-[inherit]`,
      itemContainer: `group/container flex flex-row rounded justify-between px-[10px] py-[10px] w-full border-b 
    border-${theme.alpha} last:border-none p-[0px] 
         ${
            active || isSelected
               ? inQueue
                  ? theme.content_bg + " text-white"
                  : "bg-" + theme.alpha
               : "max-[549px]:!bg-transparent"
         } 
         ${!active ? "hover:bg-" + theme.alpha : ""}`,

      imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
         inQueue ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
      }`,
      overlay:
         "absolute flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
      ctaWrapper: "flex items-center justify-end min-w-[86px] flex-shrink-0",
      menuBtnWrapper: "w-[50px] flex justify-center ",
   };

   const checkBox = (
      <>
         {!inProcess ? (
            <>
               {/* alway in state ready for select on mobile */}
               {!isChecked && !isOnMobile ? (
                  <>
                     <button
                        onClick={() => handleSelect(data)}
                        className={`${classes.songListButton} hidden ${
                           !!setIsChecked && !!setSelectedSongs
                              ? "group-hover/main:block"
                              : ""
                        }`}
                     >
                        <StopIcon className="w-[18px] " />
                     </button>
                     <button
                        className={`${classes.songListButton} ${
                           !!setIsChecked && !!setSelectedSongs
                              ? "group-hover/main:hidden group-hover/main:mr-[0px]"
                              : ""
                        }`}
                     >
                        <MusicalNoteIcon className="w-[18px]" />
                     </button>
                  </>
               ) : (
                  <button
                     onClick={() => handleSelect(data)}
                     className={`${classes.songListButton} text-[inherit]`}
                  >
                     {!isSelected ? (
                        <StopIcon className="w-[18px]" />
                     ) : (
                        <CheckIcon className="w-[18px]" />
                     )}
                  </button>
               )}
            </>
         ) : (
            <button className={`${classes.songListButton}`}>
               <MusicalNoteIcon className="w-[18px]" />
            </button>
         )}
      </>
   );

   const songComponent = (
      <div className={`flex flex-row flex-grow ${inProcess ? "opacity-60" : ""}`}>
         {!inQueue && checkBox}

         <div className="flex flex-grow " onClick={isOnMobile ? onClick : () => ""}>
            {/* song image */}
            <div className={`${classes.imageFrame}`}>
               <Image src={data.image_url} blurHashEncode={data.blurhash_encode} />

               <div
                  className={`${classes.overlay} 
               ${!active ? "hidden group-hover/main:flex" : ""}`}
               >
                  {active ? (
                     <img src={playingIcon} alt="" className="h-[18px] w-[18px]" />
                  ) : (
                     <Button
                        onClick={onClick}
                        variant={"default"}
                        className="w-[25px] text-white"
                     >
                        <PauseCircleIcon />
                     </Button>
                  )}
               </div>
            </div>

            {/* song name and singer */}
            <div className={`ml-[10px] ${inQueue ? "max-w-[96px]" : ""}`}>
               <h5
                  className={`line-clamp-1 overflow-hidden ${
                     inQueue ? "text-[13px]" : ""
                  }`}
               >
                  {data.name}
               </h5>
               <p className="text-xs opacity-[.6] line-clamp-1">{data.singer}</p>
            </div>
         </div>
      </div>
   );

   const renderHeartIcon = () => {
      if (loading) return <ArrowPathIcon className="w-[20px] animate-spin" />;
      return (
         <>
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
         </>
      );
   };

   const renderModal = useMemo(() => {
      switch (isOpenModal) {
         case "":
            return <></>;
         case "edit":
            return <SongItemEditForm close={close} song={data} admin={admin} />;
         case "delete":
            return (
               <ConfirmModal
                  loading={actionLoading}
                  label={`Delete '${data.name}' ?`}
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
                  song={data}
                  userPlaylists={userPlaylists}
               />
            );
      }
   }, [isOpenModal, actionLoading]);

   return (
      <>
         <div
            className={`${className || ""} ${!inProcess ? "group/main" : ""}  ${
               classes.itemContainer
            } ${inQueue ? "py-[6px]" : ""}`}
         >
            {/* left */}
            {songComponent}

            {/* right (cta) */}
            {inProcess ? (
               <div className="flex items-center">
                  <span>
                     <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
                  </span>
                  <p className="text-[14px]">In process...</p>
               </div>
            ) : (
               <div className={classes.ctaWrapper}>
                  {!admin && user && (
                     <button
                        onClick={handleLikeSong}
                        className={`${classes.button} max-[549px]:!bg-transparent group`}
                     >
                        {renderHeartIcon()}
                     </button>
                  )}

                  <div className={classes.menuBtnWrapper}>
                     <Popover
                        isOpenFromParent={isOpenPopup}
                        setIsOpenFromParent={setIsOpenPopup}
                        placement={inQueue ? "bottom-end" : "left"}
                     >
                        <PopoverTrigger asChild>
                           <button
                              className={`block group-hover/main:block ${
                                 classes.button
                              } ${
                                 isOpenPopup || inQueue
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
                              <SongMenu
                                 admin={admin}
                                 inPlaylist={inPlaylist}
                                 isOnMobile={isOnMobile}
                                 inQueue={inQueue}
                                 songData={data}
                                 handleOpenModal={handleOpenModal}
                                 handleAddSongToPlaylist={handleAddSongToPlaylist}
                                 handleRemoveSongFromPlaylist={
                                    handleRemoveSongFromPlaylist
                                 }
                              />

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
                        className={`text-[12px] hidden  group-hover/main:hidden ${
                           isOpenPopup || inQueue ? "hidden" : "md:block"
                        }`}
                     >
                        {handleTimeText(data.duration)}
                     </span>
                  </div>
               </div>
            )}
         </div>

         {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

export default memo(SongItem);

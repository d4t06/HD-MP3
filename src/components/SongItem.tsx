import { memo, useMemo, useState } from "react";

import { Playlist, Song, ThemeType, User } from "../types";
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

import { useActuallySongs, useAuthStore, useSongsStore, useToast } from "../store";
import { PopupWrapper, Image, Modal, SongItemEditForm, ConfirmModal, PlaylistList } from "../components";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import SongMenu from "./SongMenu";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useSongListContext } from "../store/SongListContext";
import { useSongItemActions } from "../hooks";

interface Props {
   data: Song;
   className?: string;
   active: boolean;
   onClick?: () => void;
   theme: ThemeType & { alpha: string };
   inProcess?: boolean;
   inPlaylist?: Playlist;
   inQueue?: boolean;
   admin?: boolean;
}

function SongItem({ className, data, active, onClick, theme, inProcess, inPlaylist, admin, inQueue }: Props) {
   const { userInfo, setUserInfo } = useAuthStore();
   const { setErrorToast, setSuccessToast } = useToast();
   const { actuallySongs, addToQueue, removeFromQueue } = useActuallySongs();
   const { isChecked, selectedSongs, setIsChecked, setSelectedSongs } = useSongListContext();
   const { userPlaylists } = useSongsStore();

   // state
   const [loading, setLoading] = useState<boolean>(false);
   const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
   const [modalComponent, setModalComponent] = useState<string>();

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
   };

   const {
      handleDeleteSong,
      handleAddSongToPlaylistMobile,
      handleAddSongToPlaylist,
      handleRemoveSongFromPlaylist,
      loading: actionLoading,
   } = useSongItemActions({ song: data, admin, closeModal, setIsOpenPopup });

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   const isSelected = useMemo(() => {
      if (!selectedSongs) return false;
      return selectedSongs?.indexOf(data) != -1;
   }, [selectedSongs]);
   const isLiked = useMemo(() => userInfo?.like_song_ids.includes(data.id) ?? false, [userInfo?.like_song_ids, data]);

   const handleAddToQueue = () => {
      addToQueue(data);
      setSuccessToast({ message: "Song add to queue" });
   };

   const handleLikeSong = async () => {
      if (admin) return;
      if (!userInfo || !setUserInfo) {
         console.log("lack of props");
         return;
      }

      try {
         setLoading(true);

         const newUserLikeSongIds = [...userInfo.like_song_ids];
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

         setUserInfo({ like_song_ids: newUserLikeSongIds });

         await mySetDoc({
            collection: "users",
            data: { like_song_ids: newUserLikeSongIds } as Partial<User>,
            id: userInfo.email,
         });
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
      itemContainer: `group/container flex flex-row rounded justify-between px-[10px] py-[10px] w-full border-b border-${
         theme.alpha
      } last:border-none p-[0px] 
         ${active || isSelected ? (inQueue ? theme.content_bg + " text-white" : "bg-" + theme.alpha) : ""} 
         ${!active ? "hover:bg-" + theme.alpha : ""}`,
      imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
         inQueue ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
      }`,
      overlay: "absolute flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
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
                           !!setIsChecked && !!setSelectedSongs ? "group-hover/main:block" : ""
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
                  <button onClick={() => handleSelect(data)} className={`${classes.songListButton} text-[inherit]`}>
                     {!isSelected ? <StopIcon className="w-[18px]" /> : <CheckIcon className="w-[18px]" />}
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
                     <Button onClick={onClick} variant={"default"} className="w-[25px] text-white">
                        <PauseCircleIcon />
                     </Button>
                  )}
               </div>
            </div>

            {/* song name and singer */}
            <div className={`ml-[10px] ${inQueue ? "max-w-[96px]" : ""}`}>
               <h5 className={`line-clamp-1 overflow-hidden ${inQueue ? "text-[13px]" : ""}`}>{data.name}</h5>
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
                  isLiked ? `${theme.content_text} block group-hover:hidden` : `text-white hidden group-hover:block`
               }`}
            />
            <HeartIcon className={`w-[20px] ${isLiked ? "hidden group-hover:block" : "block group-hover:hidden"}`} />
         </>
      );
   };

   return (
      <>
         <div
            className={`${className || ""} ${!inProcess ? "group/main" : ""}  ${classes.itemContainer} ${
               inQueue ? "py-[6px]" : ""
            }`}
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
                  {!admin && userInfo?.email && (
                     <button onClick={handleLikeSong} className={`${classes.button} group`}>
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
                              className={`block  group-hover/main:block ${classes.button} ${
                                 isOpenPopup || inQueue ? "md:block" : "md:hidden"
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
                              <SongMenu
                                 admin={admin}
                                 inPlaylist={inPlaylist}
                                 isOnMobile={isOnMobile}
                                 inQueue={inQueue}
                                 songData={data}
                                 handleOpenModal={handleOpenModal}
                                  handleAddSongToPlaylist={handleAddSongToPlaylist}
                                  handleRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
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

         {isOpenModal && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalComponent === "edit" && (
                  <SongItemEditForm setIsOpenModal={setIsOpenModal} theme={theme} song={data} admin={admin} />
               )}
               {modalComponent === "confirm" && (
                  <ConfirmModal
                     loading={actionLoading}
                     label={`Delete '${data.name}' ?`}
                     desc={"This action cannot be undone"}
                     theme={theme}
                     callback={handleDeleteSong}
                     setOpenModal={setIsOpenModal}
                  />
               )}

               {modalComponent === "addToPlaylist" && userPlaylists && (
                  <PlaylistList
                     loading={actionLoading}
                     handleAddSongToPlaylist={handleAddSongToPlaylistMobile}
                     setIsOpenModal={setIsOpenModal}
                     song={data}
                     userPlaylists={userPlaylists}
                  />
               )}
            </Modal>
         )}
      </>
   );
}

export default memo(SongItem);

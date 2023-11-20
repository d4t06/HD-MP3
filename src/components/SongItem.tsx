import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { Playlist, Song, ThemeType, User } from "../types";
import Button from "./ui/Button";
import {
   ArrowDownTrayIcon,
   ArrowPathIcon,
   Bars3Icon,
   CheckIcon,
   DocumentPlusIcon,
   MinusCircleIcon,
   MusicalNoteIcon,
   PauseCircleIcon,
   PencilSquareIcon,
   PlusCircleIcon,
   StopIcon,
   TrashIcon,
   HeartIcon,
   QueueListIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { handleTimeText, initSongObject, selectSongs } from "../utils/appHelpers";
import {
   FloatingFocusManager,
   autoPlacement,
   autoUpdate,
   useClick,
   useDismiss,
   useFloating,
   useInteractions,
} from "@floating-ui/react";
import { selectAllSongStore, setSong, useToast } from "../store";
import {
   PopupWrapper,
   Modal,
   Image,
   SongItemEditForm,
   ConfirmModal,
   PlaylistList,
} from "../components";

import { Link } from "react-router-dom";
import { deleteSong, mySetDoc } from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import usePlaylistActions from "../hooks/usePlaylistActions";

interface Props {
   data: Song;
   active?: boolean;
   onClick?: () => void;
   theme: ThemeType & { alpha: string };
   inProcess?: boolean;
   inPlaylist?: Playlist;
   inQueue?: boolean;
   // action: "full" | "less";

   admin?: boolean;

   userInfo?: User;
   songs?: Song[];
   setSongs?: (songs: Song[]) => void;
   userPlaylists?: Playlist[];
   setUserInfo?: (user: Partial<User>) => void;
   deleteFromPlaylist?: (song: Song) => Promise<void>;
   addToPlaylist?: (song: Song, playlist: Playlist) => Promise<void>;

   isChecked?: boolean;
   selectedSongs?: Song[];

   setSelectedSongs?: Dispatch<SetStateAction<Song[]>>;
   setIsChecked?: Dispatch<SetStateAction<boolean>>;

   actuallySongs?: Song[];
   setActuallySongs?: Dispatch<SetStateAction<Song[]>>;
}

function SongItem({
   data,
   active,
   onClick,
   theme,
   inProcess,
   inPlaylist,
   admin,
   // action,

   // song context
   userInfo,
   songs,
   userPlaylists,
   setUserInfo,
   setSongs,

   inQueue,

   // call back function
   deleteFromPlaylist,
   addToPlaylist,

   // for selected
   selectedSongs,
   isChecked,

   setSelectedSongs,
   setIsChecked,

   actuallySongs,
   setActuallySongs,
}: Props) {
   // user store
   const dispatch = useDispatch();
   const { setErrorToast, setSuccessToast } = useToast();
   const { song: songInStore } = useSelector(selectAllSongStore);

   // state
   const [loading, setLoading] = useState<boolean>(false);
   const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
   const [modalComponent, setModalComponent] = useState<string>();

   // hooks
   const { loading: PActsLoading } = usePlaylistActions({});

   // floating ui
   const { refs, floatingStyles, context } = useFloating({
      open: isOpenPopup,
      onOpenChange: setIsOpenPopup,
      middleware: [autoPlacement()],
      whileElementsMounted: autoUpdate,
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   // define call back functions
   const isSelected = useMemo(() => {
      if (!selectedSongs) return false;
      return selectedSongs?.indexOf(data) != -1;
   }, [selectedSongs]);

   const isLiked = useMemo(
      () => userInfo?.like_song_ids.includes(data.id) ?? false,
      [userInfo?.like_song_ids, data]
   );

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
   };

   const logger = (type: "[error]" | "[success]") => {
      return (msg: string) => console.log(`${type} ${msg}`);
   };

   const errorLogger = logger("[error]");
   const successLogger = logger("[success]");

   // songInStore, data, songs
   const handleDeleteSong = async () => {
      if (!userInfo || !songs || !userPlaylists || !setSongs) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

      try {
         setLoading(true);
         let newUserSongs = [...songs];

         // eliminate 1 song
         const index = newUserSongs.indexOf(data);
         newUserSongs.splice(index, 1);

         if (newUserSongs.length === songs.length) {
            errorLogger("Error newUserSongIds");
            setErrorToast({ message: "Error when handle user songs" });
            closeModal();

            return;
         }

         const newUserSongIds = newUserSongs.map((songItem) => songItem.id);
         // >>> api
         await deleteSong(data);

         await mySetDoc({
            collection: "users",
            data: {
               song_ids: newUserSongIds,
               song_count: newUserSongIds.length,
            } as Partial<User>,
            id: userInfo.email,
            msg: ">>> api: update user doc",
         });

         setSongs(newUserSongs);

         // >>> finish
         if (songInStore.id === data.id) {
            const emptySong = initSongObject({});
            dispatch(setSong({ ...emptySong, song_in: "user", currentIndex: 0 }));
         }
         successLogger("delete song completed");
         setSuccessToast({ message: `'${data.name}' deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         closeModal();
      }
   };

   // must use middle variable 'song' to add to playlist in mobile device
   const handleAddSongToPlaylist = useCallback(
      async (song: Song, playlist: Playlist) => {
         if (!song || !playlist || !addToPlaylist) {
            setErrorToast({ message: "Lack of props" });
            return;
         }
         try {
            await addToPlaylist(data, playlist);
            setSuccessToast({ message: `${song.name} added to ${playlist.name}` });
         } catch (error) {
            console.log(error);
            setErrorToast({ message: "Error when add song to playlist" });
         } finally {
            setIsOpenPopup(false);
         }
      },
      [songs, data]
   );

   const handleRemoveSongFromPlaylist = async () => {
      try {
         if (!deleteFromPlaylist) throw new Error("lack of props");

         await deleteFromPlaylist(data);
      } catch (error) {
         console.log(error);
         throw new Error("Error when remove song from playlist sdfgdfgdgdfs");
      } finally {
         setIsOpenPopup(false);
      }
   };

   const removeFromQueue = () => {
      if (!inQueue || !setActuallySongs || !actuallySongs) return;

      const newQueue = [...actuallySongs];
      const index = newQueue.indexOf(data);
      newQueue.splice(index, 1);

      if (!newQueue.length) {
         dispatch(setSong({ ...initSongObject({}), song_in: "admin", currentIndex: 0 }));
         setActuallySongs([]);
      }

      setActuallySongs(newQueue);

      if (songInStore.id === data.id) {
         dispatch(
            setSong({
               ...data,
               song_in: songInStore.song_in,
               currentIndex: songInStore.currentIndex,
            })
         );
      }

      setSuccessToast({ message: "Song removed from queue" });
      setIsOpenPopup(false);
   };

   const addToQueue = () => {
      if (!setActuallySongs || !actuallySongs) return;

      const newQueue = [...actuallySongs];
      newQueue.push(data);
      setActuallySongs(newQueue);

      setIsOpenPopup(false);
      setSuccessToast({ message: "Song added to queue" });
   };

   const handleLikeSong = async () => {
      if (!userInfo || !userPlaylists || !setUserInfo) {
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

                  addToQueue();
               }
            }
         } else {
            newUserLikeSongIds.splice(index, 1);
            if (actuallySongs) {
               const index = actuallySongs.find((s) => s.id === data.id);
               if (index) {
                  console.log("unlike songs remove from queue");

                  removeFromQueue();
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
      textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
      button: `${theme.content_hover_bg} p-[8px] rounded-full`,
      songListButton: `mr-[10px] text-[inherit]`,
      itemContainer: `flex flex-row rounded justify-between songContainers-center px-[10px] py-[10px] w-full border-b border-${
         theme.alpha
      } last:border-none p-[0px] hover:bg-${theme.alpha} ${
         isSelected && "bg-" + theme.alpha
      }`,
      imageFrame: ` relative rounded-[4px] overflow-hidden group/image flex-shrink-0 ${
         inQueue ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
      }`,
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
      input: `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} text-[14px] font-[500]`,
      overlay:
         "absolute rounded-[6px] flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
      level2Menu:
         "w-[100%] absolute right-[calc(100%+5px)] hidden group-hover:block hover:block",
      ctaWrapper: "flex items-center ",
      menuBtnWrapper: "w-[50px] flex justify-center songContainers-center",
   };

   const userInAdminPlaylist = useMemo(
      () => !admin && inPlaylist?.by === "admin",
      [admin, inPlaylist]
   );

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
         {/* hidden in check box */}
         {!inQueue && checkBox}

         {/* song image */}
         <div className="flex flex-grow " onClick={isOnMobile ? onClick : () => ""}>
            <div className={`${classes.imageFrame}`}>
               <Image src={data.image_url} blurHashEncode={data.blurhash_encode} />

               {/* hidden when in process and in list */}

               {!inProcess && (
                  <>
                     {active ? (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                           <div className="relative h-[18px] w-[18px]">
                              <img src={playingIcon} alt="" />
                           </div>
                        </div>
                     ) : (
                        !isOnMobile && (
                           <div
                              className="absolute  inset-0 bg-black bg-opacity-60 
songContainers-center justify-center items-center hidden group-hover/image:flex"
                           >
                              <Button
                                 onClick={onClick}
                                 variant={"default"}
                                 className="h-[25px] w-[25px] text-white"
                              >
                                 <PauseCircleIcon />
                              </Button>
                           </div>
                        )
                     )}
                  </>
               )}
            </div>

            {/* song info */}
            <div className="ml-[10px]">
               <h5 className={`line-clamp-1 ${inQueue ? "text-[13px]" : ""}`}>
                  {data.name}
               </h5>
               <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
            </div>
         </div>
      </div>
   );

   const renderAddToPlaylistBtn = (
      <>
         {isOnMobile ? (
            <Button
               className={`group relative ${theme.content_hover_text} ${classes.before}`}
               variant={"list"}
               onClick={() => handleOpenModal("addToPlaylist")}
            >
               <PlusCircleIcon className="w-[18px] mr-[5px]" />
               Add to playlist
               {/* level 2 */}
            </Button>
         ) : (
            <Button
               className={`group relative ${theme.content_hover_text} ${classes.before}`}
               variant={"list"}
            >
               <PlusCircleIcon className="w-[18px] mr-[5px]" />
               Add to playlist
               {/* level 2 */}
               <PopupWrapper
                  classNames={`${classes.level2Menu} ${PActsLoading ? "hidden" : ""}`}
                  theme={theme}
               >
                  {/* playlist */}
                  <ul className="w-[150px]">
                     {!!userPlaylists?.length && (
                        <>
                           {userPlaylists.map((playlist, index) => {
                              const isAdded = playlist.song_ids.includes(data.id);

                              return (
                                 <li
                                    key={index}
                                    onClick={() =>
                                       !isAdded && handleAddSongToPlaylist(data, playlist)
                                    }
                                    className={`list-none flex rounded-[4px] p-[5px] ${
                                       isAdded && "opacity-60 pointer-events-none"
                                    } ${!isAdded && theme.content_hover_text}`}
                                 >
                                    <MusicalNoteIcon className={`w-[20px] mr-[5px]`} />
                                    <p>{playlist.name}</p>
                                 </li>
                              );
                           })}
                        </>
                     )}
                  </ul>
               </PopupWrapper>
            </Button>
         )}
      </>
   );

   const menuComponent = (
      <div className={` ${inQueue ? "w-[160px]" : "w-[200px]"} relative`}>
         {!isOnMobile && (
            <>
               <h5 className="text-mg line-clamp-1">{data.name}</h5>
               <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
            </>
         )}

         <div className="mt-[14px]">
            {setActuallySongs && actuallySongs && (
               <>
                  {inQueue ? (
                     <Button
                        onClick={removeFromQueue}
                        className={`${theme.content_hover_text}`}
                        variant={"list"}
                     >
                        <TrashIcon className="w-[18px] mr-[5px]" />
                        Remove
                     </Button>
                  ) : (
                     <Button
                        onClick={addToQueue}
                        className={`${theme.content_hover_text}`}
                        variant={"list"}
                     >
                        <QueueListIcon className="w-[18px] mr-[5px]" />
                        Add to queue
                     </Button>
                  )}
               </>
            )}

            {/* alway visible in dashboard */}
            {userInfo?.email && (
               <>
                  {(admin && !inPlaylist) || !inPlaylist || userInAdminPlaylist ? (
                     renderAddToPlaylistBtn
                  ) : (
                     <>
                        {!active && (
                           <Button
                              className={`${theme.content_hover_text}`}
                              variant={"list"}
                              onClick={() => handleRemoveSongFromPlaylist()}
                           >
                              <MinusCircleIcon className="w-[18px] mr-[5px]" />
                              Remove from playlist
                           </Button>
                        )}
                     </>
                  )}
               </>
            )}

            {/* alway visible in dashboard    */}
            {(admin || data.by !== "admin") && !inQueue && (
               <>
                  <Button
                     onClick={() => handleOpenModal("edit")}
                     className={`${theme.content_hover_text}`}
                     variant={"list"}
                  >
                     <PencilSquareIcon className="w-[18px] mr-[5px]" />
                     Edit
                  </Button>
                  {data.lyric_id ? (
                     <Link to={`/mysongs/edit/${data.id}`}>
                        <Button
                           className={`${theme.content_hover_text}`}
                           variant={"list"}
                        >
                           <DocumentPlusIcon className="w-[18px] mr-[5px]" />
                           Edit lyric
                        </Button>
                     </Link>
                  ) : (
                     <Link to={`/mysongs/edit/${data.id}`}>
                        <Button
                           className={`${theme.content_hover_text}`}
                           variant={"list"}
                        >
                           <DocumentPlusIcon className="w-[18px] mr-[5px]" />
                           Add lyric
                        </Button>
                     </Link>
                  )}
                  <Button
                     onClick={() => handleOpenModal("confirm")}
                     className={`${theme.content_hover_text}`}
                     variant={"list"}
                  >
                     <TrashIcon className="w-[18px] mr-[5px]" />
                     Delete
                  </Button>
               </>
            )}

            <a
               target="_blank"
               download
               href={data.song_url}
               className={`${theme.content_hover_text} text-[14px] inline-flex items-center cursor-pointer`}
            >
               <ArrowDownTrayIcon className="w-[18px] mr-[5px]" />
               Download
            </a>
         </div>

         {!inQueue && (
            <p className="opacity-60 text-center text-[12px] mt-[10px]">
               uploaded by {data.by}
            </p>
         )}
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
            <HeartIcon
               className={`w-[20px] ${
                  isLiked ? "hidden group-hover:block" : "block group-hover:hidden"
               }`}
            />
         </>
      );
   };

   return (
      <div className={`${!inProcess && "group/main"}  ${classes.itemContainer}`}>
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
            <>
               <div className={classes.ctaWrapper}>
                  {!admin && (
                     <Button
                        onClick={handleLikeSong}
                        className={`${classes.button} group`}
                     >
                        {renderHeartIcon()}
                     </Button>
                  )}
                  <div className={classes.menuBtnWrapper}>
                     <button
                        ref={refs.setReference}
                        {...getReferenceProps()}
                        className={`block group-hover/main:block ${classes.button} ${
                           isOpenPopup || inQueue ? "md:block" : "md:hidden"
                        }`}
                     >
                        <Bars3Icon className="w-[20px]" />
                     </button>
                     <span
                        className={`text-[12px] hidden  group-hover/main:hidden ${
                           isOpenPopup || inQueue ? "hidden" : "md:block"
                        }`}
                     >
                        {handleTimeText(data.duration)}
                     </span>
                  </div>
               </div>
            </>
         )}

         {isOpenPopup && !inProcess && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <PopupWrapper theme={theme}>{menuComponent}</PopupWrapper>
                  {PActsLoading && (
                     <div className={classes.overlay}>
                        <span className="text-[#fff]">
                           <ArrowPathIcon className="w-[40px] animate-spin" />
                        </span>
                     </div>
                  )}
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && !inProcess && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalComponent === "edit" && (
                  <SongItemEditForm
                     setIsOpenModal={setIsOpenModal}
                     theme={theme}
                     song={data}
                     admin={admin}
                  />
               )}
               {modalComponent === "confirm" && (
                  <ConfirmModal
                     loading={loading}
                     label={`Delete '${data.name}' ?`}
                     desc={"This action cannot be undone"}
                     theme={theme}
                     callback={handleDeleteSong}
                     setOpenModal={setIsOpenModal}
                  />
               )}

               {modalComponent === "addToPlaylist" && userPlaylists && (
                  <PlaylistList
                     loading={PActsLoading}
                     handleAddSongToPlaylist={handleAddSongToPlaylist}
                     setIsOpenModal={setIsOpenModal}
                     song={data}
                     userPlaylists={userPlaylists}
                  />
               )}
            </Modal>
         )}
      </div>
   );
}

export default SongItem;

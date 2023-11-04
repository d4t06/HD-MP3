import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { Playlist, Song, ThemeType, User } from "../types";
import Button from "./ui/Button";
import {
   ArrowDownTrayIcon,
   ArrowPathIcon,
   Bars3Icon,
   CheckIcon,
   DocumentPlusIcon,
   HeartIcon,
   MinusCircleIcon,
   MusicalNoteIcon,
   PauseCircleIcon,
   PencilSquareIcon,
   PlusCircleIcon,
   StopIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import playingIcon from "../assets/icon-playing.gif";
import {
   generatePlaylistAfterChangeSong,
   handleTimeText,
   initSongObject,
   updatePlaylistsValue,
   updateSongsListValue,
} from "../utils/appHelpers";
import {
   FloatingFocusManager,
   autoPlacement,
   autoUpdate,
   useClick,
   useDismiss,
   useFloating,
   useInteractions,
} from "@floating-ui/react";
import { selectAllSongStore, setPlaylist, setSong, useToast } from "../store";
import {
   PopupWrapper,
   Modal,
   Image,
   SongItemEditForm,
   ConfirmModal,
} from "../components";

import { Link } from "react-router-dom";
import { deleteSong, mySetDoc } from "../utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import { UseSongItemActionsType } from "../hooks/useSongItemActions";
import {
   handlePlaylistWhenDeleteSong,
   handleSongWhenAddToPlaylist,
} from "../utils/songItemHelper";

type ModalName = "ADD_PLAYLIST";

interface Props {
   data: Song;
   active?: boolean;
   onClick?: () => void;
   theme: ThemeType & { alpha: string };
   inProcess?: boolean;
   inPlaylist?: boolean;

   songItemActions?: UseSongItemActionsType;

   userInfo?: User;
   userSongs?: Song[];
   userPlaylists?: Playlist[];
   setUserSongs?: (userSongs: Song[]) => void;
   setUserPlaylists?: (userPlaylists: Playlist[], adminPlaylists: []) => void;
   deleteFromPlaylist?: (song: Song) => void;

   isCheckedSong?: boolean;
   selectedSongList?: Song[];

   setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;
   setIsCheckedSong?: Dispatch<SetStateAction<boolean>>;

   handleOpenParentModal?: (name: ModalName) => void;
}

export default function SongListItem({
   data,
   active,
   onClick,
   theme,
   inProcess,
   inPlaylist,

   // song context
   userInfo,
   userSongs,
   userPlaylists,
   setUserSongs,
   setUserPlaylists,

   songItemActions,

   // call back function
   deleteFromPlaylist,

   // for selected
   selectedSongList,
   isCheckedSong,
   setSelectedSongList,
   setIsCheckedSong,

   handleOpenParentModal,
}: Props) {
   // user store
   const dispatch = useDispatch();
   const { setErrorToast, setSuccessToast } = useToast();
   const { playlist: playlistInStore, song: songInStore } =
      useSelector(selectAllSongStore);

   // state
   const [loading, setLoading] = useState<boolean>(false);
   const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
   const [modalComponent, setModalComponent] = useState<string>();

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
      if (!selectedSongList) return false;
      return selectedSongList?.indexOf(data) != -1;
   }, [selectedSongList]);

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
   };

   // songInStore, data, userSongs
   const handleDeleteSong = useCallback(async () => {
      if (
         !userInfo ||
         !userSongs ||
         !userPlaylists ||
         !setUserSongs ||
         !setUserPlaylists ||
         !songItemActions
      ) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

      try {
         setLoading(true);

         // if song added in some playlist
         let newUserPlaylists: Playlist[] | undefined;
         let playlistsNeedToUpdate: Playlist[] | undefined;

         if (data.in_playlist.length) {
            newUserPlaylists = [...userPlaylists];

            const { error, playlistsNeedToUpdateDoc } =
               await handlePlaylistWhenDeleteSong(data, newUserPlaylists);

            if (error || !playlistsNeedToUpdateDoc) {
               closeModal();
               setErrorToast({ message: "Error when handle playlist" });

               return;
            }
            playlistsNeedToUpdate = playlistsNeedToUpdateDoc;
         }

         // >>> local
         const newUserSongIds = await songItemActions.updateAndSetUserSongs({
            song: data,
         });

         if (!newUserSongIds) {
            setErrorToast({ message: "Error when handle user songs" });
            closeModal();

            return;
         }

         if (playlistsNeedToUpdate) {
            if (newUserPlaylists) {
               for (let playlist of playlistsNeedToUpdate) {
                  updatePlaylistsValue(playlist, newUserPlaylists);

                  //  if user is playing this playlist
                  if (playlist.id === playlistInStore.id) {
                     dispatch(setPlaylist(playlist));
                  }

                  // >>> api
                  await mySetDoc({
                     collection: "playlist",
                     data: playlist,
                     id: playlist.id,
                     msg: ">>> api: update playlist doc",
                  });
               }

               // >>> local
               setUserPlaylists(newUserPlaylists, []);
            }
         }

         // >>> api
         // delete song file, image file, song doc and lyric doc
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

         // >>> finish
         if (songInStore.id === data.id) {
            const emptySong = initSongObject({});
            dispatch(setSong({ ...emptySong, song_in: "user", currentIndex: 0 }));
         }
         console.log("[success]: delete song completed");
         setSuccessToast({ message: `'${data.name}' deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         closeModal();
      }
   }, [userSongs, songInStore, data]);

   // userSongs
   const handleAddSongToPlaylist = useCallback(
      async (song: Song, playlist: Playlist) => {
         if (!song || !playlist || !songItemActions) {
            setErrorToast({ message: "Lack of props" });
            return;
         }

         try {
            // case admin song
            if (data.by === "admin") {
               console.log("song by admin");

               const newPlaylist = generatePlaylistAfterChangeSong({ song, playlist });
               // check valid playlist after change
               if (
                  newPlaylist.count < 0 ||
                  newPlaylist.time < 0 ||
                  newPlaylist.song_ids.length === playlist.song_ids.length
               ) {
                  setErrorToast({ message: "New playlist error" });
                  return;
               }

               //  >>>local & api
               console.log("check new playlist", newPlaylist);

               await songItemActions.setPlaylistDocAndSetUserPlaylists({ newPlaylist });
               setSuccessToast({ message: `'${song.name}' added to ${playlist.name}` });
               return;
            }

            // case user song
            // check props
            if (!userSongs || !setUserSongs) {
               setErrorToast({ message: "Lack of props" });
               return;
            }

            const { error, newSong } = handleSongWhenAddToPlaylist(song, playlist);
            // check valid song after change
            if (error || !newSong) {
               setErrorToast({ message: "New song error" });
               return;
            }

            const newUserSongs = [...userSongs];
            updateSongsListValue(newSong as Song, newUserSongs);

            const newPlaylist = generatePlaylistAfterChangeSong({
               song: newSong as Song,
               playlist,
            });
            // check valid playlist after change
            if (
               newPlaylist.count < 0 ||
               newPlaylist.time < 0 ||
               newPlaylist.song_ids.length === playlist.song_ids.length
            ) {
               setErrorToast({ message: "New playlist error" });
               return;
            }

            // >>> local
            setUserSongs(newUserSongs);

            // >>> api
            await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });
            await songItemActions.setPlaylistDocAndSetUserPlaylists({ newPlaylist });

            // finish
            setSuccessToast({ message: `'${song.name}' added to ${playlist.name}` });
         } catch (error) {
            console.log(error);
            setErrorToast({});
         } finally {
            setIsOpenPopup(false);
         }
      },
      [userSongs, data]
   );

   //selectedSongList
   const handleSelect = useCallback(
      (song: Song) => {
         if (!setSelectedSongList || !selectedSongList || !setIsCheckedSong) {
            setErrorToast({ message: "Selected lack of props" });
            return;
         }
         setIsCheckedSong(true);

         let list = [...selectedSongList];
         const index = list.indexOf(song);

         // if no present
         if (index === -1) {
            list.push(song);

            // if present
         } else {
            list.splice(index, 1);
         }
         setSelectedSongList(list);
         if (!list.length) setIsCheckedSong(false);
      },
      [selectedSongList]
   );

   // define style
   const classes = {
      textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
      button: `${theme.content_hover_bg} p-[8px] rounded-full`,
      songListButton: `mr-[10px] text-[inherit]`,
      itemContainer: `w-full border-b border-${
         theme.alpha
      } last:border-none p-[0px] hover:bg-${theme.alpha} ${
         isSelected && "bg-" + theme.alpha
      }`,
      imageFrame: `h-[54px] w-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0`,
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
      input: `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} text-[14px] font-[500]`,
   };

   const songComponent = (
      <div className={`flex flex-row ${inProcess ? "opacity-60" : ""}`}>
         <>
            {/* check box */}
            {!inProcess ? (
               <>
                  {!isCheckedSong ? (
                     <>
                        <button
                           onClick={() => handleSelect(data)}
                           className={`${classes.songListButton} hidden group-hover/main:block`}
                        >
                           <StopIcon className="w-[18px] " />
                        </button>
                        <button
                           className={`${classes.songListButton} group-hover/main:hidden group-hover/main:mr-[0px]`}
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

         {/* song image */}
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
                  )}
               </>
            )}
         </div>

         {/* song info */}
         <div className="ml-[10px]">
            <h5 className="text-mg line-clamp-1">{data.name}</h5>
            <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
         </div>
      </div>
   );

   //   theme, active, userPlaylists, data, handleAddSongToPlaylist, deleteFromPlaylist
   const menuComponent = useMemo(
      () => (
         <div className="w-[200px]">
            {!isOnMobile && (
               <>
                  <h5 className="text-mg line-clamp-1">{data.name}</h5>
                  <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
               </>
            )}

            {userInfo?.email && (
               <>
                  {!inPlaylist ? (
                     <Button
                        className={`mt-[15px] group relative ${theme.content_hover_text} ${classes.before}`}
                        variant={"list"}
                     >
                        <PlusCircleIcon className="w-[18px] mr-[5px]" />
                        Add to playlist
                        {/* level 2 */}
                        <PopupWrapper
                           classNames="w-[100%] absolute right-[calc(100%+5px)] hidden group-hover:block hover:block"
                           theme={theme}
                        >
                           {/* playlist */}
                           <ul className="w-[150px]">
                              {!!userPlaylists?.length && (
                                 <>
                                    {userPlaylists.map((playlist, index) => {
                                       const isAdded = playlist.song_ids.includes(
                                          data.id
                                       );

                                       return (
                                          <li
                                             key={index}
                                             onClick={() =>
                                                !isAdded &&
                                                handleAddSongToPlaylist(data, playlist)
                                             }
                                             className={`list-none flex rounded-[4px] p-[5px] ${
                                                isAdded && "opacity-60"
                                             } ${!isAdded && theme.content_hover_text}`}
                                          >
                                             <MusicalNoteIcon
                                                className={`w-[20px] mr-[5px]`}
                                             />
                                             <p>
                                                {playlist.name} {isAdded && "(added)"}
                                             </p>
                                          </li>
                                       );
                                    })}
                                 </>
                              )}
                              <li
                                 onClick={() =>
                                    handleOpenParentModal &&
                                    handleOpenParentModal("ADD_PLAYLIST")
                                 }
                                 className={`list-none flex rounded-[4px] p-[5px] ${theme.content_hover_text}`}
                              >
                                 <PlusCircleIcon className={`w-[18px] mr-[5px]`} />
                                 Add new playlist
                              </li>
                           </ul>
                        </PopupWrapper>
                     </Button>
                  ) : (
                     <>
                        {!active && (
                           <Button
                              className={`mt-[15px] ${theme.content_hover_text}`}
                              variant={"list"}
                              onClick={() =>
                                 deleteFromPlaylist && deleteFromPlaylist(data)
                              }
                           >
                              <MinusCircleIcon className="w-[18px] mr-[5px]" />
                              Remove from playlist
                           </Button>
                        )}
                     </>
                  )}
               </>
            )}

            {data.by != "admin" && (
               <>
                  <a
                  target="_blank"
                     download
                     href={data.song_url}
                     className={`${theme.content_hover_text} text-[14px] inline-flex items-center cursor-pointer`}
                  >
                     <ArrowDownTrayIcon className="w-[18px] mr-[5px]" />
                     Download
                  </a>
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

            <p className="opacity-60 text-center text-[12px] mt-[10px]">
               uploaded by {data.by}
            </p>
         </div>
      ),
      [theme, active, userPlaylists, data, handleAddSongToPlaylist, deleteFromPlaylist]
   );

   return (
      <div
         className={`${
            !inProcess && "group/main"
         } flex flex-row rounded justify-between songContainers-center px-[10px] py-[10px] ${
            classes.itemContainer
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
            <>
               <div className="flex flex-row items-center gap-x-[5px]">
                  <Button
                     className={`${classes.button} ${
                        theme.type === "light" ? "hover:text-[#333]" : "hover:text-white"
                     }`}
                  >
                     <HeartIcon className="w-[20px]" />
                  </Button>

                  <div className="w-[80px] flex justify-center songContainers-center">
                     <button
                        ref={refs.setReference}
                        {...getReferenceProps()}
                        className={`group-hover/main:block ${classes.button}
            ${isOpenPopup ? "block cursor-default" : "hidden "}
            ${theme.type === "light" ? "hover:text-[#333]" : "hover:text-white"}
            `}
                     >
                        <Bars3Icon className="w-[20px]" />
                     </button>
                     <span
                        className={`text-[12px] group-hover/main:hidden ${
                           isOpenPopup && "hidden"
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
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && !inProcess && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalComponent === "edit" && (
                  <SongItemEditForm
                     setIsOpenModal={setIsOpenModal}
                     setUserSongs={setUserSongs}
                     theme={theme}
                     userSongs={userSongs}
                     data={data}
                  />
               )}
               {modalComponent === "confirm" && <ConfirmModal 
                 loading = {loading}
                 label = {`Delete '${data.name}'`}
                 desc = {"This action cannot be undone"}
                 theme = {theme}
                 callback = {handleDeleteSong}
                 setOpenModal = {setIsOpenModal}
               />}
            </Modal>
         )}
      </div>
   );
}

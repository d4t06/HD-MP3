import {
   Dispatch,
   MouseEventHandler,
   SetStateAction,
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";

import { Playlist, Song, ThemeType, User } from "../../types";
import Button from "./Button";
import {
   ArrowPathIcon,
   ArrowUpTrayIcon,
   Bars3Icon,
   CheckIcon,
   DocumentMagnifyingGlassIcon,
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
import handleTimeText from "../../utils/handleTimeText";
import {
   FloatingFocusManager,
   autoPlacement,
   autoUpdate,
   useClick,
   useDismiss,
   useFloating,
   useInteractions,
} from "@floating-ui/react";
import PopupWrapper from "./PopupWrapper";
import Modal from "../Modal";
import {  doc, setDoc } from "firebase/firestore";
import { db, store } from "../../config/firebase";
import { Link } from "react-router-dom";
import { deleteSong, updateSongsListValue, updateUser } from "../../utils/crud";

interface Props {
   data: Song;
   active?: boolean;
   autoScroll?: boolean;
   onClick?: () => void;
   theme: ThemeType & { alpha: string };
   inProcess?: boolean;
   inList?: boolean;
   inPlaylist?: boolean;

   userData?: User;
   userSongs?: Song[];
   userPlaylists?: Playlist[];
   setUserSongs?: (userSongs: Song[]) => void;
   deleteFromPlaylist?: (song: Song) => void;
   addSongToPlaylist?: (song: Song, playlist: Playlist) => void;

   isCheckedSong?: boolean;
   selectedSongList?: Song[];

   setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;
   setIsCheckedSong?: Dispatch<SetStateAction<boolean>>;
}

export default function SongListItem({
   data,
   active,
   autoScroll,
   onClick,
   theme,
   inProcess,
   inList,
   inPlaylist,

   userData,
   userSongs,
   userPlaylists,
   setUserSongs,
   deleteFromPlaylist,
   addSongToPlaylist,

   selectedSongList,

   isCheckedSong,
   setSelectedSongList,
   setIsCheckedSong,
}: Props) {
   const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
   const [inputFields, setInputFields] = useState({
      name: data.name,
      singer: data.singer,
      image_path: data.image_path,
   });
   const [modalComponent, setModalComponent] = useState<string>();
   const [loading, setLoading] = useState<boolean>(false);

   const songContainer = useRef<HTMLDivElement>(null);

   const isSelected = useCallback(() => {
      if (!selectedSongList) return false;
      return selectedSongList?.indexOf(data) != -1;
   }, [selectedSongList]);

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
   // end floating ui

   const handleInput = (field: keyof typeof inputFields, value: string) => {
      setInputFields({ ...inputFields, [field]: value });
   };

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const handleEditSong = async (song: Song) => {
      if (!userSongs || !setUserSongs) {
         console.log("edit fail usersongs not found");
         return;
      }

      if (
         data.name != inputFields.name ||
         data.singer != inputFields.singer ||
         data.image_path != inputFields.image_path
      ) {
         setLoading(true);

         const newSong: Song = { ...song, ...inputFields };
         const songsList = [...userSongs];

         // update data arrays value
         updateSongsListValue(newSong, songsList);

         // update user doc
         await setDoc(doc(db, "songs", song.id), newSong, { merge: true });
         
         // update users songs context
         setUserSongs(songsList);

         setLoading(false);
         setIsOpenModal(false);
      }
   };
   const handleDeleteSong: MouseEventHandler = async () => {
      if (!userData || !userSongs || !setUserSongs) return;
      console.log("handleDeleteSong check userSongIds", userSongs);

      try {
         setLoading(true);

         await deleteSong(data);

         // reference copy newUserSongIds = userSongIds;
         // const newUserSongIds = [...userSongIds];
         const newUserSongs = [...userSongs];

         // get index of deleted song in userSongs
         const index = newUserSongs.indexOf(data);
         newUserSongs.splice(index, 1);

         const newUserSongIds = newUserSongs.map((song) => song.id);

         // update user doc
         await updateUser(newUserSongIds, userData);

         // update user songs
         setUserSongs(newUserSongs);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setLoading(false);
         setIsOpenModal(false);
      }
   };

   const handeAddSongToPlaylist = (song: Song, playlist: Playlist) => {
      addSongToPlaylist && addSongToPlaylist(song, playlist);
      setIsOpenPopup(false);
   };

   const handleSelect = (song: Song) => {
      if (!setSelectedSongList || !selectedSongList || !setIsCheckedSong) {
         console.log("songlistitem lack of props");
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
   };

   useEffect(() => {
      if (!autoScroll) return;
      console.log("scroll");
   }, [active]);

   const classes = {
      textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
      songListButton: `mr-[10px] text-${theme.alpha} group-hover/main:text-[inherit]`,
      itemContainer: `border-b border-${theme.alpha} ${
         window.innerWidth > 549 && "p-[0px] hover:bg-" + theme.alpha
      }  ${isSelected() && "bg-" + theme.alpha}`,
      imageFrame: `h-[54px] w-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0`,
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
   };

   const buttonClasses = "h-[35px] w-[35px] p-[8px] rounded-full";
   const inputClasses = `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} ${classes.textColor} text-[14px] font-[500]`;

   const songComponent = (
      <>
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
                           {!isSelected() ? (
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
            <div className={classes.imageFrame}>
               <img
                  className=""
                  src={data?.image_path || "https://placehold.co/100"}
                  alt=""
               />

               {/* hidden when in process and in list */}
               {active && !inProcess && !inList && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex songContainers-center items-center justify-center">
                     <div className="relative h-[18px] w-[18px]">
                        <img
                           src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                           alt=""
                        />
                     </div>
                  </div>
               )}

               {/* hidden when in process and in list */}

               {!active && !inProcess && !inList && (
                  <div
                     className="absolute  inset-0 bg-black bg-opacity-60 
    songContainers-center justify-center items-center hidden max-[549px]:hidden group-hover/image:flex"
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
            </div>

            {/* song info */}
            <div className="ml-[10px]">
               <h5 className="text-mg line-clamp-1">{data.name}</h5>
               <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
            </div>
         </div>
      </>
   );

   const editComponent = (
      <div className="w-[50vw] h-[auto]">
         <input id="editImageInput" type="file" className="hidden" />
         <h1 className="text-[20px] font-semibold">Chỉnh sửa</h1>
         <div className="flex mt-[10px]">
            <div>
               <div className="w-[130px] h-[130px] flex-shrink-0 rounded-[5px]">
                  <img
                     className="w-[100%] object-cover object-center rounded-[5px]"
                     src={
                        inputFields.image_path ||
                        data.image_path ||
                        "https://placehold.co/200"
                     }
                     alt="adsfkl"
                  />
               </div>

               <label
                  htmlFor="editImageInput"
                  className={`inline-block mt-[10px] cursor-pointer hover:brightness-90 px-[20px] py-[5px] bg-${theme.alpha} rounded-full text-[14px]`}
               >
                  <ArrowUpTrayIcon className="w-[15px]" />
               </label>
            </div>
            <div className="ml-[20px] w-full flex flex-col gap-[10px]">
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Tên: </p>
                  <input
                     className={inputClasses}
                     value={inputFields.name}
                     type="text"
                     onChange={(e) => handleInput("name", e.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Thể hiện: </p>
                  <input
                     className={inputClasses}
                     value={inputFields.singer}
                     onChange={(e) => handleInput("singer", e.target.value)}
                     type="text"
                  />
               </div>
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Url ảnh: </p>
                  <input
                     className={inputClasses}
                     value={inputFields.image_path}
                     onChange={(e) => handleInput("image_path", e.target.value)}
                     type="text"
                  />
               </div>

               <div className="flex gap-[10px] mt-[10px]">
                  <Button
                     isLoading={loading}
                     onClick={() => handleEditSong(data)}
                     className={`bg-${theme.alpha} rounded-full text-[14px]`}
                     variant={"primary"}
                  >
                     Lưu
                  </Button>
                  <Button
                     onClick={(e) => {
                        e.stopPropagation();
                        setIsOpenModal(false);
                     }}
                     className={`${theme.content_bg} rounded-full text-[14px]`}
                     variant={"primary"}
                  >
                     Đóng
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );

   const dialogComponent = useMemo(
      () => (
         <>
            <div className="w-[30vw]">
               <h1 className="text-[20px] font-semibold">Chắc chưa ?</h1>
               <p className="text-[red]">This action cannot be undone</p>

               <div className="flex gap-[10px] mt-[20px]">
                  <Button
                     isLoading={loading}
                     className={`${theme.content_bg} rounded-full text-[14px]`}
                     variant={"primary"}
                     onClick={handleDeleteSong}
                  >
                     Xóa mẹ nó đi !
                  </Button>
                  <Button
                     onClick={() => setIsOpenModal(false)}
                     className={`bg-${theme.alpha} rounded-full text-[14px]`}
                     variant={"primary"}
                  >
                     Khoan từ từ
                  </Button>
               </div>
            </div>
         </>
      ),
      [loading, theme]
   );

   // console.log("check isSelected", isSelected(), inList, active);

   return (
      <div
         ref={songContainer}
         onClick={() => window.innerWidth <= 549 && onClick && onClick()}
         className={`${
            !inProcess && "group/main"
         } flex flex-row rounded justify-between      songContainers-center px-[10px] py-[10px] max-[549px]:px-[0px] ${
            classes.itemContainer
         }`}
      >
         {/* left */}
         {songComponent}

         {/* right, hidden when in list */}
         {!inList && (
            <>
               {/* when upload song */}
               {inProcess ? (
                  <div className="flex items-center">
                     <span>
                        <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
                     </span>
                     <p className="text-[14px]">In process...</p>
                  </div>
               ) : (
                  <>
                     {/* cta */}
                     <div className="flex flex-row items-center gap-x-[5px]">
                        <Button
                           className={`${buttonClasses} ${theme.content_hover_bg} ${
                              theme.type === "light"
                                 ? "hover:text-[#33]"
                                 : "hover:text-white"
                           }`}
                        >
                           <HeartIcon />
                        </Button>

                        <div className="w-[80px] flex justify-center songContainers-center">
                           <button
                              ref={refs.setReference}
                              {...getReferenceProps()}
                              className={`group-hover/main:block ${buttonClasses}
            ${isOpenPopup ? "block cursor-default" : "hidden " + theme.content_hover_bg}
            ${theme.type === "light" ? "hover:text-[#33]" : "hover:text-white"}
            max-[549px]:block
            `}
                           >
                              <Bars3Icon />
                           </button>
                           <span
                              className={`text-[12px] group-hover/main:hidden ${
                                 isOpenPopup && "hidden"
                              } max-[549px]:hidden`}
                           >
                              {handleTimeText(data.duration)}
                           </span>
                        </div>
                     </div>
                  </>
               )}
            </>
         )}

         {/* song item menu */}
         {isOpenPopup && !inProcess && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <PopupWrapper theme={theme}>
                     <div className="w-[200px]">
                        {window.innerWidth > 549 && (
                           <>
                              <h5 className="text-mg line-clamp-1">{data.name}</h5>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                 {data.singer}
                              </p>
                           </>
                        )}

                        {!inPlaylist ? (
                           <Button
                              className={`mt-[15px] group relative ${theme.content_hover_text} ${classes.before}`}
                              variant={"list"}
                           >
                              <PlusCircleIcon className="w-[18px] mr-[5px]" />
                              Thêm vào playlist
                              <PopupWrapper
                                 classNames="w-[100%] absolute right-[calc(100%+5px)] hidden group-hover:block hover:block"
                                 theme={theme}
                              >
                                 {/* playlist */}
                                 {userPlaylists?.length ? (
                                    <ul>
                                       {userPlaylists.map((playlist, index) => {
                                          const isAdded = playlist.song_ids.includes(
                                             data.id
                                          );
                                          return (
                                             <li
                                                key={index}
                                                onClick={() =>
                                                   !isAdded &&
                                                   handeAddSongToPlaylist(data, playlist)
                                                }
                                                className={`list-none flex rounded-[4px] p-[5px] ${
                                                   isAdded && "opacity-60"
                                                } ${
                                                   !isAdded && theme.content_hover_text
                                                }`}
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
                                       <li
                                          className={`list-none flex rounded-[4px] p-[5px] ${theme.content_hover_text}`}
                                       >
                                          <PlusCircleIcon
                                             className={`w-[20px] mr-[5px]`}
                                          />
                                          Add new playlist
                                       </li>
                                    </ul>
                                 ) : (
                                    <Button
                                       onClick={() => handleOpenModal("addSongs")}
                                       className={`${theme.content_bg} rounded-full`}
                                       variant={"primary"}
                                    >
                                       <PlusCircleIcon className="w-[30px] mr-[5px]" />
                                       Thêm playlist
                                    </Button>
                                 )}
                              </PopupWrapper>
                           </Button>
                        ) : (
                           <Button
                              className={`mt-[15px] ${theme.content_hover_text}`}
                              variant={"list"}
                              onClick={() =>
                                 deleteFromPlaylist && deleteFromPlaylist(data)
                              }
                           >
                              <MinusCircleIcon className="w-[18px] mr-[5px]" />
                              Xóa khõi playlist
                           </Button>
                        )}

                        {data.by != "admin" && (
                           <>
                              <Button
                                 onClick={() => handleOpenModal("edit")}
                                 className={`${theme.content_hover_text}`}
                                 variant={"list"}
                              >
                                 <PencilSquareIcon className="w-[18px] mr-[5px]" />
                                 Chỉnh Sửa
                              </Button>

                              {data.lyric_id ? (
                                 <Button
                                    className={`${theme.content_hover_text}`}
                                    variant={"list"}
                                    onClick={() => handleOpenModal("edit")}
                                 >
                                    <DocumentMagnifyingGlassIcon className="w-[18px] mr-[5px]" />
                                    Chỉnh sủa lời bài hát
                                 </Button>
                              ) : (
                                 <Link to={`/React-Zingmp3/edit/${data.id}`}>
                                    <Button
                                       className={`${theme.content_hover_text}`}
                                       variant={"list"}
                                    >
                                       <DocumentPlusIcon className="w-[18px] mr-[5px]" />
                                       Thêm lời bài hát
                                    </Button>
                                 </Link>
                              )}

                              <Button
                                 onClick={() => handleOpenModal("confirm")}
                                 className={`${theme.content_hover_text}`}
                                 variant={"list"}
                              >
                                 <TrashIcon className="w-[18px] mr-[5px]" />
                                 Xóa
                              </Button>
                           </>
                        )}

                        <p className="opacity-60 text-center text-[13px] mt-[10px">
                           Thêm bởi {data.by}
                        </p>
                     </div>
                  </PopupWrapper>
               </div>
            </FloatingFocusManager>
         )}

         {/* modal */}
         {isOpenModal && !inProcess && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>
                  {modalComponent === "edit" && editComponent}
                  {modalComponent === "confirm" && dialogComponent}
               </PopupWrapper>
            </Modal>
         )}
      </div>
   );
}

import { ChevronLeftIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Song } from "../types";

// store
import {
   useTheme,
   selectAllSongStore,
   useSongsStore,
   useToast,
   useAuthStore,
   setSong,
} from "../store";

// utils
import {
   deleteSong,
   setUserSongIdsAndCountDoc,
} from "../utils/firebaseHelpers";

// hooks
import { useUploadSongs, useSongs, useSongItemActions } from "../hooks";
// components
import {
   Empty,
   MobileSongItem,
   Modal,
   Button,
   SongItem,
   PlaylistItem,
   Skeleton,
   ConfirmModal,
   AddPlaylist,
} from "../components";

import { routes } from "../routes";
import { SongItemSkeleton, PlaylistSkeleton } from "../components/skeleton";

type ModalName = "ADD_PLAYLIST" | "CONFIRM";

export default function MySongsPage() {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { setErrorToast, setSuccessToast } = useToast();
   const { loading: initialLoading, errorMsg, initial } = useSongs({});

   const { song: songInStore } =
      useSelector(selectAllSongStore);
   const { userPlaylists, setUserSongs, setUserPlaylists, userSongs } = useSongsStore();
   const songItemActions = useSongItemActions();

   // state
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");

   // ref
   const inputRef = useRef<HTMLInputElement>(null);
   const firstTempSong = useRef<HTMLDivElement>(null);
   const testImageRef = useRef<HTMLImageElement>(null);

   //  for delete song
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);

   // use hooks
   const navigate = useNavigate();
   const { tempSongs, addedSongIds, status, handleInputChange } = useUploadSongs({
      audioRef,
      firstTempSong,
      testImageRef,
      inputRef,
   });

   // define callback functions
   const handleOpenModal = (name: ModalName) => {
      setModalName(name);
      setOpenModal(true);
   };

   const handleSetSong = (song: Song, index: number) => {
      // when user play playlist then play user songs
      if (songInStore.id !== song.id || songInStore.song_in !== "user") {
         console.log("set song");
         dispatch(setSong({ ...song, currentIndex: index, song_in: "user" }));
      }
   };

   const songCount = useMemo(() => {
      if (initialLoading || !initial) return 0;
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs, initial, initialLoading]);

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   const resetCheckedList = () => {
      setSelectedSongList([]);
      setIsCheckedSong(false);
   };

   const closeModal = () => {
      setLoading(false);
      setOpenModal(false);
   };

   const handleDeleteSelectedSong = async () => {
      const newUserSongs = [...userSongs];

      try {
         setLoading(true);
         for (let song of selectedSongList) {
            const index = newUserSongs.findIndex((item) => item.id === song.id);
            newUserSongs.splice(index, 1);
         }
         // >>> api
         for (let song of selectedSongList) {
            await deleteSong(song);
         }
         const userSongIds: string[] = newUserSongs.map((song) => song.id);
         await setUserSongIdsAndCountDoc({ songIds: userSongIds, userInfo });

         setUserSongs(newUserSongs);

         // >>> finish
         setSuccessToast({ message: `${selectedSongList.length} songs deleted` });
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete songs" });
      } finally {
         resetCheckedList();
         closeModal();
      }
   };

   // define classes
   const classes = {
      button: `${theme.content_bg} rounded-full`,
      songItemContainer: `w-full border-b border-${theme.alpha}`,
   };

   // tempSongs, addedSongIds, theme
   const renderTempSongs = useMemo(() => {
      if (!tempSongs.length) return;

      return tempSongs.map((tempSong, index) => {
         const isAdded = addedSongIds.some((id) => id === tempSong.id);
         if (index == 0 && !firstTempSong.current) {
            return (
               <SongItem
                  theme={theme}
                  onClick={() => handleSetSong(tempSong, index)}
                  inProcess={!isAdded}
                  key={index}
                  data={tempSong}
               />
            );
         }

         return (
            <SongItem
               theme={theme}
               onClick={() => handleSetSong(tempSong, index)}
               inProcess={!isAdded}
               data={tempSong}
               key={index}
            />
         );
      });
   }, [tempSongs, addedSongIds, theme]);

   //   theme, userInfo, userSongs, songInStore, selectedSongList, isCheckedSong, userPlaylists
   const renderUserSongs = useMemo(() => {
      if (!userSongs.length) return;

      return userSongs.map((song, index) => {
         const active =
            song.id === songInStore.id &&
            songInStore.song_in === "user" &&
            song.singer === songInStore.singer;
         if (isOnMobile) {
            return (
               <MobileSongItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={active}
                  key={index}
                  data={song}
                  isCheckedSong={isCheckedSong}
                  selectedSongList={selectedSongList}
                  setIsCheckedSong={setIsCheckedSong}
                  setSelectedSongList={setSelectedSongList}
               />
            );
         }
         return (
            <div key={index} className={classes.songItemContainer}>
               <SongItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={active}
                  key={index}
                  data={song}
                  userInfo={userInfo}
                  userSongs={userSongs}
                  userPlaylists={userPlaylists}
                  setUserSongs={setUserSongs}
                  setUserPlaylists={setUserPlaylists}
                  isCheckedSong={isCheckedSong}
                  setIsCheckedSong={setIsCheckedSong}
                  selectedSongList={selectedSongList}
                  setSelectedSongList={setSelectedSongList}
                  handleOpenParentModal={handleOpenModal}
                  songItemActions={songItemActions}
               />
            </div>
         );
      });
   }, [
      theme,
      userInfo,
      userSongs,
      songInStore,
      selectedSongList,
      isCheckedSong,
      userPlaylists,
   ]);

   // define modals
   const ModalPopup: Record<ModalName, ReactNode> = {
      ADD_PLAYLIST: (
         <AddPlaylist setIsOpenModal={setOpenModal} theme={theme} userInfo={userInfo} />
      ),
      CONFIRM: (
         <ConfirmModal
            loading={loading}
            label={"Wait a minute"}
            theme={theme}
            callback={handleDeleteSelectedSong}
            setOpenModal={setOpenModal}
         />
      ),
   };

   // route guard
   useEffect(() => {
      if (userInfo.status === "loading") return;

      if (!userInfo.email) {
         navigate(routes.Home);
         console.log(">>> navigate to home");
      }
   }, [userInfo, initial]);

   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <>
         <img className="hidden" ref={testImageRef} />
         {/* playlist */}
         <div className="pb-[30px] ">
            {/* mobile nav */}
            {isOnMobile && (
               <Link
                  to={routes.Home}
                  className="inline-flex items-center mb-[30px] hover:opacity-75"
               >
                  <ChevronLeftIcon className="w-[25px]" />
                  <span className="text-[20px] font-semibold leading-1">Home</span>
               </Link>
            )}

            <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>
            <div className="flex flex-row flex-wrap">
               {!!userPlaylists.length &&
                  !initialLoading &&
                  userPlaylists.map((playList, index) => (
                     <div key={index} className="w-1/4 p-[8px] max-[549px]:w-1/2">
                        {isOnMobile ? (
                           <Link to={`${routes.Playlist}/${playList.id}`}>
                              <PlaylistItem data={playList} />
                           </Link>
                        ) : (
                           <PlaylistItem theme={theme} data={playList} />
                        )}
                     </div>
                  ))}
               {initialLoading && PlaylistSkeleton}
               {(
                  <div className="w-1/4 p-[8px] max-[549px]:w-1/2 mb-[25px]">
                     <Empty
                        theme={theme}
                        className="pt-[100%]"
                        onClick={() => handleOpenModal("ADD_PLAYLIST")}
                     />
                  </div>
               )}
            </div>
         </div>

         {/* song list */}
         <div className="pb-[30px] max-[549px]:pb-[80px]">
            {/* title */}
            <div className="flex justify-between">
               <h3 className="text-2xl font-bold">Songs</h3>
               {/* for upload song */}
               <input
                  ref={inputRef}
                  onChange={handleInputChange}
                  type="file"
                  multiple
                  accept=".mp3"
                  id="file"
                  className="hidden"
               />
               <audio ref={audioRef} className="hidden" />
               <div className="flex items-center">
                  <label
                     className={`${theme.content_bg} ${
                        status === "uploading" || initialLoading
                           ? "opacity-60 pointer-events-none"
                           : ""
                     } rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                     htmlFor="file"
                  >
                     <PlusCircleIcon className="w-[20px] mr-[5px]" />
                     Upload
                  </label>
               </div>
            </div>

            {/* song list */}
            <div
               className={`flex gap-[12px] items-center border-b border-${theme.alpha} h-[60px]`}
            >
               {initialLoading && <Skeleton className="h-[20px] w-[150px]" />}

               {/* checked song */}
               {!initialLoading && (
                  <p className="text-[14px]] font-semibold text-gray-500 w-[100px]">
                     {!isCheckedSong ? (
                       
                           (songCount ? songCount : 0) + " songs"
                        
                     ) : (
                        
                           selectedSongList.length + " selected"
                        
                     )}
                  </p>
               )}
               {isCheckedSong && userSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongList(userSongs)}
                        variant={"primary"}
                        className={classes.button}
                     >
                        All
                     </Button>
                     <Button
                        onClick={() => handleOpenModal("CONFIRM")}
                        variant={"primary"}
                        className={classes.button}
                     >
                        Delete
                     </Button>
                     <Button
                        onClick={() => {
                           setIsCheckedSong(false);
                           setSelectedSongList([]);
                        }}
                        className={`px-[5px]`}
                     >
                        <XMarkIcon className="w-[25px]" />
                     </Button>
                  </>
               )}
            </div>
            <div className="min-h-[50vh]">
               {!!songCount && !initialLoading ? (
                  <>
                     {!!userSongs.length && renderUserSongs}
                     {!!tempSongs.length && renderTempSongs}
                  </>
               ) : (
                  !initialLoading && <p>No songs jet...</p>
               )}

               {initialLoading && SongItemSkeleton}
            </div>
         </div>

         {/* add playlist modal */}
         {openModal && (
            <Modal theme={theme} setOpenModal={setOpenModal}>
               {ModalPopup[modalName]}
            </Modal>
         )}
      </>
   );
}

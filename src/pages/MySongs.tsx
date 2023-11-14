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
import { deleteSong, setUserSongIdsAndCountDoc } from "../utils/firebaseHelpers";

// hooks
import { useUploadSongs, useSongs } from "../hooks";
// components
import {
   Empty,
   Modal,
   Button,
   SongItem,
   PlaylistItem,
   Skeleton,
   ConfirmModal,
   AddPlaylist,
   SongList,
} from "../components";

import { routes } from "../routes";
import { SongItemSkeleton, PlaylistSkeleton } from "../components/skeleton";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";

type ModalName = "ADD_PLAYLIST" | "CONFIRM";

export default function MySongsPage() {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { setErrorToast, setSuccessToast } = useToast();
   const { loading: initialLoading, errorMsg, initial } = useSongs({});

   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);
   const {
      playStatus: { isPlaying },
   } = useSelector(selectAllPlayStatusStore);
   const { userPlaylists, setUserSongs, userSongs } = useSongsStore();

   // state
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");

   // ref
   const audioRef = useRef<HTMLAudioElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const firstTempSong = useRef<HTMLDivElement>(null);
   const testImageRef = useRef<HTMLImageElement>(null);
   const [isChecked, setIsChecked] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

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
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const closeModal = () => {
      setLoading(false);
      setOpenModal(false);
   };

   const handleDeleteSelectedSong = async () => {
      const newUserSongs = [...userSongs];

      try {
         setLoading(true);
         for (let song of selectedSongs) {
            const index = newUserSongs.findIndex((item) => item.id === song.id);
            newUserSongs.splice(index, 1);
         }
         // >>> api
         for (let song of selectedSongs) {
            await deleteSong(song);
         }
         const userSongIds: string[] = newUserSongs.map((song) => song.id);
         await setUserSongIdsAndCountDoc({ songIds: userSongIds, userInfo });

         setUserSongs(newUserSongs);

         // >>> finish
         setSuccessToast({ message: `${selectedSongs.length} songs deleted` });
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
   }, [userInfo.status, initial]);

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
                  className={`inline-block p-[8px] rounded-full mb-[30px] ${theme.content_hover_bg} bg-${theme.alpha}`}
               >
                  <ChevronLeftIcon className="w-[25px]" />
               </Link>
            )}

            <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>
            <div className="flex flex-row flex-wrap -mx-[8px]">
               {!!userPlaylists.length &&
                  !initialLoading &&
                  userPlaylists.map((playlist, index) => {
                     const active =
                        playlistInStore.id === playlist.id &&
                        isPlaying &&
                        songInStore.song_in.includes("playlist");
                     return (
                        <div key={index} className="w-1/4 p-[8px] max-[549px]:w-1/2">
                           <PlaylistItem active={active} theme={theme} data={playlist} />
                        </div>
                     );
                  })}
               {initialLoading && PlaylistSkeleton}
               {
                  <div className="w-1/4 p-[8px] max-[549px]:w-1/2 mb-[25px]">
                     <Empty
                        theme={theme}
                        className="pt-[100%]"
                        onClick={() => handleOpenModal("ADD_PLAYLIST")}
                     />
                  </div>
               }
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
                     {!isChecked
                        ? (songCount ? songCount : 0) + " songs"
                        : selectedSongs.length + " selected"}
                  </p>
               )}
               {isChecked && userSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongs(userSongs)}
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
                           setIsChecked(false);
                           setSelectedSongs([]);
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
                     {!!userSongs.length && (
                        <SongList
                           handleSetSong={handleSetSong}
                           activeExtend={songInStore.song_in === "user"}
                           isChecked={isChecked}
                           setIsChecked={setIsChecked}
                           setSelectedSongs={setSelectedSongs}
                           selectedSongs={selectedSongs}
                           songs={userSongs}
                        />
                     )}
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

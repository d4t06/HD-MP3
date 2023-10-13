import { ChevronLeftIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Playlist, Song } from "../types";

// store
import { useTheme } from "../store/ThemeContext";
import { selectAllSongStore, setPlaylist, setSong } from "../store/SongSlice";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";

// utils
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { generateId, updatePlaylistsValue } from "../utils/appHelpers";
import {
   deleteSong,
   mySetDoc,
   setUserPlaylistIdsDoc,
   setUserSongIdsAndCountDoc,
} from "../utils/firebaseHelpers";

// hooks
import useUploadSongs from "../hooks/useUploadSongs";

// components
import Empty from "../components/ui/Empty";
import Skeleton from "../components/skeleton";
import MobileSongItem from "../components/MobileSongItem";
import Modal, { confirmModal } from "../components/Modal";
import PopupWrapper from "../components/ui/PopupWrapper";
import PlaylistItem from "../components/PlaylistItem";
import Button from "../components/ui/Button";
import useSongs from "../hooks/useSongs";
import SongItem from "../components/SongItem";
import useSongItemActions from "../hooks/useSongItemActions";
import { handlePlaylistWhenDeleteManySongs } from "../utils/songItemHelper";
import { useAuthStore } from "../store/AuthContext";
import { routes } from "../routes";

type ModalName = "ADD_PLAYLIST" | "CONFIRM";

export default function MySongsPage() {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { setErrorToast, setSuccessToast } = useToast();
   const { loading: initialLoading, errorMsg, initial } = useSongs();

   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);
   const { userPlaylists, setUserSongs, setUserPlaylists, userSongs } = useSongsStore();
   const songItemActions = useSongItemActions();

   // define state
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");
   const [playlistName, setPlayListName] = useState<string>("");

   //  for delete song
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const message = useRef<string>("");

   // use hooks
   const navigate = useNavigate();
   const { tempSongs, addedSongIds, status, handleInputChange } = useUploadSongs({
      audioRef,
      message,
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

      console.log('check user song', userSongs.length);
      
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs, initial, initialLoading]);

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 550;
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
      let isOneSongInPlaylist = false;
      const newUserSongs = [...userSongs];
      const newUserPlaylists = [...userPlaylists];

      try {
         setLoading(true);

         // loop each selected song, update playlist need to update
         const playlistsNeedToUpdate: Playlist[] = [];
         for (let song of selectedSongList) {
            
            // if some song added in some playlist
            if (song.in_playlist.length) {
               isOneSongInPlaylist = true;
               // problem, this is just for one song
               const { error } = handlePlaylistWhenDeleteManySongs(
                  song,
                  playlistsNeedToUpdate,
                  newUserPlaylists
               );

               if (error) {
                  setLoading(false);
                  closeModal();
                  setErrorToast({ message: "Error when handle playlist" });
                  return;
               }
            }

            const index = newUserSongs.findIndex((item) => item.id === song.id);
            newUserSongs.splice(index, 1);
         }

         for (let playlist of playlistsNeedToUpdate) {
            updatePlaylistsValue(playlist, newUserPlaylists);

            if (playlist.id === playlistInStore.id) {
               dispatch(setPlaylist(playlist));
            }

            // >>> api
            await mySetDoc({
               collection: "playlist",
               data: playlist,
               id: playlist.id,
            });
         }

         // >>> local
         if (isOneSongInPlaylist) {
            setUserPlaylists(newUserPlaylists, []);
         }
         setUserSongs(newUserSongs);

         // >>> api
         for (let song of selectedSongList) {
            await deleteSong(song);
         }

         const userSongIds: string[] = newUserSongs.map((song) => song.id);
         setUserSongIdsAndCountDoc({ songIds: userSongIds, userInfo });

         // >>> finish
         resetCheckedList();
         closeModal();
         setSuccessToast({ message: `${selectedSongList.length} songs deleted` });
      } catch (error) {
         setErrorToast({ message: "Catch error" });
      }
   };

   const handleAddPlaylist = async () => {
      const playlistId = generateId(playlistName, userInfo.email);

      if (!playlistId || !playlistName || !userInfo) {
         setErrorToast({});
         return;
      }

      const addedPlaylist: Playlist = {
         id: playlistId,
         image_by: "",
         image_file_path: "",
         image_url: "",
         by: userInfo?.email || "users",
         name: playlistName,
         song_ids: [],
         count: 0,
         time: 0,
      };

      // insert new playlist to users playlist
      const newPlaylists = [...userPlaylists, addedPlaylist];

      try {
         setLoading(true);
         // add to playlist collection
         await setDoc(doc(db, "playlist", playlistId), addedPlaylist);

         // update user doc
         await setUserPlaylistIdsDoc(newPlaylists, userInfo);

         // update context store user playlists
         setUserPlaylists(newPlaylists, []);
         closeModal();
         setPlayListName("");

         setSuccessToast({ message: `'${playlistName}' created` });
      } catch (error) {
         setErrorToast({});
      }
   };

   // define jsx
   const renderTempSongs = useMemo(() => {
      if (!tempSongs.length) return;
      return tempSongs.map((tempSong, index) => {
         const isAdded = addedSongIds.some((id) => id === tempSong.id);

         return (
            <div key={index} className="w-full max-[549px]:w-full">
               <SongItem
                  theme={theme}
                  onClick={() => handleSetSong(tempSong, index)}
                  inProcess={!isAdded}
                  key={index}
                  data={tempSong}
               />
            </div>
         );
      });
   }, [tempSongs, addedSongIds, theme]);

   //   theme, userInfo, userSongs, songInStore, selectedSongList, isCheckedSong, userPlaylists
   const renderUserSongs = useMemo(() => {
      if (!userSongs.length) return;

      return userSongs.map((song, index) => {
         const active = song.id === songInStore.id && songInStore.song_in === "user";
         if (isOnMobile) {
            return (
               <div key={index} className="w-full max-[549px]:w-full">
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
               </div>
            );
         }
         return (
            <div key={index} className="w-full max-[549px]:w-full">
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
   }, [theme, userInfo, userSongs, songInStore, selectedSongList, isCheckedSong, userPlaylists]);

   // define classes
   const classes = {
      button: `${theme.content_bg} rounded-full`,
   };

   // define modals
   const useConfirmModal = useMemo(
      () =>
         confirmModal({
            loading: loading,
            label: "Wait a minute",
            theme: theme,
            callback: handleDeleteSelectedSong,
            setOpenModal: setOpenModal,
         }),
      [loading, theme, selectedSongList]
   );

   const addPlaylistModal = (
      <div className="w-[300px]">
         <Button className="absolute top-2 right-2 text-white" onClick={() => setOpenModal(false)}>
            <XMarkIcon className="w-6 h-6" />
         </Button>
         <h2 className="text-[18px] font-semibold text-white">Add Playlist</h2>
         <input
            className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
            type="text"
            placeholder="name..."
            value={playlistName}
            onChange={(e) => setPlayListName(e.target.value)}
         />

         <Button
            isLoading={loading}
            onClick={() => handleAddPlaylist()}
            variant={"primary"}
            className={`${classes.button} mt-[15px]`}
         >
            Save
         </Button>
      </div>
   );

   const ModalPopup: Record<ModalName, ReactNode> = {
      ADD_PLAYLIST: addPlaylistModal,
      CONFIRM: useConfirmModal,
   };

   // define skeleton
   const playlistSkeleton = [...Array(2).keys()].map((index) => {
      return (
         <div key={index} className="w-1/4 p-[8px] max-[459px]:w-1/2">
            <Skeleton className="pt-[100%] rounded-[8px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[50%]" />
         </div>
      );
   });

   const SongItemSkeleton = [...Array(5).keys()].map((index) => {
      return (
         <div key={index} className="flex items-center p-[10px]">
            <Skeleton className="h-[18px] w-[18px]" />

            <Skeleton className="h-[54px] w-[54px] ml-[10px] rounded-[4px]" />
            <div className="ml-[10px]">
               <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
               <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
            </div>
         </div>
      );
   });


   // route guard
   useEffect(() => {
      if (!userInfo.email) {
         navigate(routes.Home);

         return;
      }
   }, [userInfo]);

   if (errorMsg) return <h1>{errorMsg}</h1>;

   console.log("my songs render check user song", songCount, initialLoading );
   // setToasts

   return (
      <>
         {/* playlist */}
         <div className="pb-[30px] ">
            {/* mobile nav */}
            {isOnMobile && (
               <Link
                  to={routes.Home}
                  className="inline-flex items-center mb-[30px] hover:opacity-75"
               >
                  <button className="">
                     <ChevronLeftIcon className="w-[25px]" />
                  </button>
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
                              <PlaylistItem
                                 data={playList}
                              />
                           </Link>
                        ) : (
                           <PlaylistItem
                              theme={theme}
                              data={playList}
                           />
                        )}
                     </div>
                  ))}
               {!initialLoading && (
                  <div className="w-1/4 p-[8px] max-[549px]:w-1/2 mb-[25px]">
                     <Empty
                        theme={theme}
                        className="pt-[100%]"
                        onClick={() => handleOpenModal("ADD_PLAYLIST")}
                     />
                  </div>
               )}
               {initialLoading && playlistSkeleton}
            </div>
         </div>

         {/* song list */}
         <div className="pb-[30px] max-[549px]:pb-[80px]">
            {/* title */}
            <div className="flex justify-between mb-[10px]">
               <h3 className="text-2xl font-bold">Songs</h3>
               <input
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
                     } rounded-full flex px-[20px] py-[4px] text-white cursor-pointer`}
                     htmlFor="file"
                  >
                     <PlusCircleIcon className="w-[20px] mr-[5px]" />
                     Upload
                  </label>
               </div>
            </div>

            {/* song list */}
            <div
               className={`flex gap-[12px] items-center border-b border-${theme.alpha} h-[50px] mb-[10px]`}
            >
               {initialLoading && <Skeleton className="h-[20px] w-[150px]" />}

               {/* checked song */}
               {!initialLoading && (
                  <>
                     {!isCheckedSong ? (
                        <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                           {(songCount ? songCount : 0) + " songs"}
                        </p>
                     ) : (
                        <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                           {selectedSongList.length + " selected"}
                        </p>
                     )}
                  </>
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
            <div className="-mx-[8px] min-h-[50vh]">
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
            <Modal setOpenModal={setOpenModal}>
               <PopupWrapper theme={theme}>{ModalPopup[modalName]}</PopupWrapper>
            </Modal>
         )}
      </>
   );
}

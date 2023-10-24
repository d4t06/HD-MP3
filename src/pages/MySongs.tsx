import { ChevronLeftIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Playlist, Song } from "../types";

// store
import {
   useTheme,
   selectAllSongStore,
   useSongsStore,
   useToast,
   useAuthStore,
   setPlaylist,
   setSong,
} from "../store";

// utils
import {
   deleteSong,
   mySetDoc,
   setUserPlaylistIdsDoc,
   setUserSongIdsAndCountDoc,
} from "../utils/firebaseHelpers";
import { generateId, updatePlaylistsValue } from "../utils/appHelpers";
import { handlePlaylistWhenDeleteManySongs } from "../utils/songItemHelper";

// hooks
import { useUploadSongs, useSongs, useSongItemActions } from "../hooks";
// components
import {
   Empty,
   MobileSongItem,
   Modal,
   Button,
   SongItem,
   PopupWrapper,
   PlaylistItem,
   Skeleton,
} from "../components";
import { confirmModal } from "../components/Modal";

import { routes } from "../routes";
import { SongItemSkeleton, playlistSkeleton } from "../components/skeleton";

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

   // state
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");
   const [playlistName, setPlayListName] = useState<string>("");

   // ref
   const inputRef = useRef<HTMLInputElement>(null);
   const firstTempSong = useRef<HTMLDivElement>(null);
   const testImageRef = useRef<HTMLImageElement>(null);

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
      firstTempSong,
      testImageRef,
      inputRef
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
      const playlistId = generateId(playlistName) + userInfo.email.replace("@gmail.com", "");

      if (!playlistId || !playlistName || !userInfo) {
         setErrorToast({ message: "Add playlist lack of props" });
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
         blurhash_encode: "",
      };

      // insert new playlist to users playlist
      const newPlaylists = [...userPlaylists, addedPlaylist];

      try {
         setLoading(true);
         // add to playlist collection
         await mySetDoc({ collection: "playlist", data: addedPlaylist, id: playlistId });

         // update user doc
         await setUserPlaylistIdsDoc(newPlaylists, userInfo);

         // update context store user playlists
         setUserPlaylists(newPlaylists, []);
         closeModal();
         setPlayListName("");

         setSuccessToast({ message: `'${playlistName}' created` });
      } catch (error) {
         setErrorToast({ message: "Add playlist catch error" });
      }
   };

   // define jsx
   const renderTempSongs = useMemo(() => {
      if (!tempSongs.length) return;

      return tempSongs.map((tempSong, index) => {
         const isAdded = addedSongIds.some((id) => id === tempSong.id);
         if (index == 0 && !firstTempSong.current) {
            return (
               <div ref={firstTempSong} key={index} className="w-full max-[549px]:w-full">
                  <SongItem
                     theme={theme}
                     onClick={() => handleSetSong(tempSong, index)}
                     inProcess={!isAdded}
                     key={index}
                     data={tempSong}
                  />
               </div>
            );
         }

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
         const active =
            song.id === songInStore.id &&
            songInStore.song_in === "user" &&
            song.singer === songInStore.singer;
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
         <Button className="absolute top-2 right-2" onClick={() => setOpenModal(false)}>
            <XMarkIcon className="w-6 h-6" />
         </Button>
         <h2 className="text-[18px] font-semibold">Add Playlist</h2>
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

   // route guard
   useEffect(() => {
      if (userInfo.status === "loading") return;
      if (!userInfo.email) {
         navigate(routes.Home);

         return;
      }
   }, [userInfo]);

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
            <Modal setOpenModal={setOpenModal}>
               <PopupWrapper theme={theme}>{ModalPopup[modalName]}</PopupWrapper>
            </Modal>
         )}
      </>
   );
}

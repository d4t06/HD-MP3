import {
   ArrowPathIcon,
   ChevronLeftIcon,
   PencilSquareIcon,
   PlayIcon,
   PlusCircleIcon,
   TrashIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";

import { Song } from "../types";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import { useTheme, useSongsStore, useToast, selectAllSongStore, setSong } from "../store";
import { useSongItemActions, usePlaylistDetail } from "../hooks";
import {
   handleTimeText,
   generatePlaylistAfterChangeSongs,
   updateSongsListValue,
} from "../utils/appHelpers";
import {
   PlaylistItem,
   Button,
   Skeleton,
   AddSongToPlaylistModal,
   Modal,
   ConfirmModal,
   SongItem,
} from "../components";

import usePlaylistActions from "../hooks/usePlaylistActions";

export default function DashboardPlaylist() {
   // *** store
   const { theme } = useTheme();
   const { setSuccessToast, setErrorToast } = useToast();
   const { userSongs, adminSongs } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);

   // *** state
   const firstTimeRender = useRef(true);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<
      "edit" | "confirm" | "addSongs"
   >();
   // for multiselect songItem
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   // for edit playlist
   const [playlistName, setPlaylistName] = useState<string>(playlistInStore.name);

   //  *** use hooks
   const {
      editPlaylist,
      deletePlaylist,
      loading: playlistActionLoading,
      deleteManyFromPlaylist,
      deleteSongFromPlaylist,
      addSongToPlaylist,
   } = usePlaylistActions({});
   // const { setPlaylistDocAndSetUserPlaylists } = useSongItemActions();
   const {
      playlistSongs,
      loading: usePlaylistLoading,
      setPlaylistSongs,
   } = usePlaylistDetail({
      firstTimeRender,
      playlistInStore,
      songInStore,
      admin: true,
   });

   //    // case user play user songs then play playlist song
   //    if (
   //       songInStore.id !== song.id ||
   //       !songInStore.song_in.includes(playlistInStore.name)
   //    ) {
   //       const newSongIn: Status["song_in"] =
   //          playlistInStore.by === "admin"
   //             ? `admin-playlist-${playlistInStore.name as string}`
   //             : `user-playlist-${playlistInStore.name as string}`;

   //       dispatch(
   //          setSong({
   //             ...song,
   //             currentIndex: index,
   //             song_in: newSongIn,
   //          })
   //       );

   //       if (!songInStore.song_in.includes(playlistInStore.name)) {
   //          setActuallySongs(playlistSongs);
   //       }
   //    }
   // };

   // const handlePlayPlaylist = () => {
   //    const firstSong = playlistSongs[0];

   //    if (songInStore.song_in.includes(params.name as string)) return;
   //    handleSetSong(firstSong, 0);
   // };

   const handleEditPlaylist = async () => {
      try {
         await editPlaylist(playlistName, playlistInStore);
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when edit playlist" });
      }
   };
   const handleAddSongsToPlaylist = async (selectedSongListFromModal: Song[]) => {
      try {
         await addSongToPlaylist(
            selectedSongListFromModal,
            playlistSongs,
            playlistInStore
         );
         const newPlaylistSongs = [...playlistSongs, ...selectedSongListFromModal];
         setPlaylistSongs(newPlaylistSongs);
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when add song to playlist" });
      } finally {
         setIsOpenModal(false);
      }
   };

   const deleteFromPlaylist = async (song: Song) => {
      try {
         const newPlaylistSongs = await deleteSongFromPlaylist(playlistSongs, song);
         if (newPlaylistSongs) {
            setPlaylistSongs(newPlaylistSongs);
         }
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      }
   };

   const handleDeleteManyFromPlaylist = async () => {
      try {
         await deleteManyFromPlaylist(selectedSongList, playlistSongs);
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      } finally {
         setIsOpenModal(false);
      }
   };
   const handleDeletePlaylist = async () => {
      try {
         await deletePlaylist(playlistInStore);
      } catch (error) {
         console.log(error);
      } finally {
         setIsOpenModal(false);
      }
   };

   const openModal = (name: "edit" | "confirm" | "addSongs") => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setIsOpenModal(false);
      setIsCheckedSong(false);
      setSelectedSongList([]);
   };

   const songCount = useMemo(() => playlistSongs.length, [playlistSongs]);

   const classes = {
      addSongContainer: "pb-[50px] relative",
      addSongContent: "max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full ",
      editContainer: "w-[400px] max-w-[90vw] max-h-[90vh]",
      input: "text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full",
      button: `${theme.content_bg} rounded-full`,
      playListTop: "w-full flex",
      playlistInfoContainer: "ml-[15px]",
      songListContainer: "h-[50px] mb-[10px] flex gap-[20px] ] items-center border-b",
      countSongText: "text-[14px]] font-semibold text-gray-500 w-[100px]",

      buttonAddSongContainer: "w-full text-center mt-[30px]",
   };

   // playlistSongs, songInStore, isCheckedSong, selectedSongList, isOpenModal
   const renderPlaylistSongs = useMemo(() => {
      return playlistSongs.map((song, index) => {
         return (
            <SongItem
               key={index}
               admin={true}
               isCheckedSong={isCheckedSong && !isOpenModal}
               setIsCheckedSong={setIsCheckedSong}
               selectedSongList={selectedSongList}
               setSelectedSongList={setSelectedSongList}
               deleteFromPlaylist={deleteFromPlaylist}
               theme={theme}
               active={false}
               data={song}
               inPlaylist
            />
         );
      });
   }, [
      playlistInStore.name,
      songInStore,
      playlistSongs,
      isCheckedSong,
      selectedSongList,
      isOpenModal,
   ]);

   const editComponent = (
      <div
         className={`${classes.editContainer} ${
            usePlaylistLoading ? "opacity-60 pointer-events-none" : ""
         }`}
      >
         <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            type="text"
            className={`${classes.input} bg-${theme.alpha} ${
               theme.type === "light" ? "text-[#333]" : "text-white"
            }`}
         />

         <Button
            onClick={() => handleEditPlaylist()}
            variant={"primary"}
            className={`${theme.content_bg} rounded-full self-end mt-[15px]`}
         >
            {usePlaylistLoading ? (
               <ArrowPathIcon className="w-[20px] animate-spin" />
            ) : (
               "Save"
            )}
         </Button>
      </div>
   );

   // for define skeleton
   const playlistSkeleton = (
      <div className="flex">
         <div className="w-1/4 ">
            <Skeleton className="pt-[100%] rounded-[8px]" />
         </div>
         <div className="min-[550px]:ml-[15px]  justify-between">
            <Skeleton className="h-[30px]  w-[100px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[50px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
         </div>
      </div>
   );

   useEffect(() => {
      setPlaylistName(playlistInStore.name);
   }, []);

   return (
      <div className="playlist-page">
         {/* head */}
         {usePlaylistLoading && playlistSkeleton}
         {!usePlaylistLoading && !!playlistInStore.name && (
            <div className={classes.playListTop}>
               {/* image */}
               <div className="w-1/4">
                  <PlaylistItem data={playlistInStore} inDetail theme={theme} />
               </div>

               {/* playlist info */}
               <div className={classes.playlistInfoContainer}>
                  <div className="">
                     <h3 className="text-[20px] font-semibold leading-1">
                        {playlistInStore.name}
                        <button onClick={() => openModal("edit")} className="p-[5px]">
                           <PencilSquareIcon className="w-[20px]" />
                        </button>
                     </h3>
                     <p className="text-[16px]">
                        {handleTimeText(playlistInStore?.time)}
                     </p>
                     <p className="text-[14px] opacity-60">
                        create by {playlistInStore.by}
                     </p>
                  </div>

                  {/* cta */}
                  <div className="flex items-center mt-[15px] gap-[12px]">
                     <Button
                        onClick={() => openModal("confirm")}
                        className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
                     >
                        <TrashIcon className="w-[25px]" />
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {/* songs list */}
         <div className="pb-[50px]">
            <div className={`${classes.songListContainer} border-${theme.alpha}`}>
               {usePlaylistLoading && <Skeleton className="h-[20px] w-[150px]" />}

               {!isCheckedSong ? (
                  <p className={classes.countSongText}>{songCount + " songs"}</p>
               ) : (
                  <p className={classes.countSongText}>
                     {selectedSongList.length + " selected"}
                  </p>
               )}
               {isCheckedSong && playlistSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongList(playlistSongs)}
                        variant={"primary"}
                        className={classes.button}
                     >
                        All
                     </Button>
                     <Button
                        onClick={() => handleDeleteManyFromPlaylist()}
                        variant={"primary"}
                        className={classes.button}
                     >
                        Remove
                     </Button>
                     <Button
                        onClick={() => {
                           setIsCheckedSong(false);
                           setSelectedSongList([]);
                        }}
                        className={`p-[5px]`}
                     >
                        <XMarkIcon className="w-[20px]" />
                     </Button>
                  </>
               )}
            </div>

            {/* {usePlaylistLoading && SongItemSkeleton} */}

            {!usePlaylistLoading && !!playlistSongs.length && renderPlaylistSongs}

            {(!!userSongs.length || !!adminSongs.length) && (
               <div className={classes.buttonAddSongContainer}>
                  <Button
                     onClick={() => openModal("addSongs")}
                     className={`${theme.content_bg} rounded-full`}
                     variant={"primary"}
                  >
                     <PlusCircleIcon className="w-[30px] mr-[5px]" />
                     Add song
                  </Button>
               </div>
            )}
         </div>

         {/* modal */}
         {isOpenModal && (
            <Modal classNames="" theme={theme} setOpenModal={closeModal}>
               {modalComponent === "edit" && editComponent}
               {modalComponent === "confirm" && (
                  <ConfirmModal
                     loading={playlistActionLoading}
                     label={"Delete playlist ?"}
                     theme={theme}
                     callback={handleDeletePlaylist}
                     setOpenModal={setIsOpenModal}
                  />
               )}
               {modalComponent === "addSongs" && (
                  <AddSongToPlaylistModal
                     admin
                     theme={theme}
                     addSongsToPlaylist={handleAddSongsToPlaylist}
                     playlistSongs={playlistSongs}
                  />
               )}
            </Modal>
         )}
      </div>
   );
}

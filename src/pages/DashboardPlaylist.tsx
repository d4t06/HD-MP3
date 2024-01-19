import { PencilSquareIcon, PlusCircleIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Song } from "../types";

import { useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { useTheme, useSongsStore, useToast, selectAllSongStore } from "../store";
import { usePlaylistDetail } from "../hooks";
import { handleTimeText } from "../utils/appHelpers";
import {
   PlaylistItem,
   Button,
   Skeleton,
   AddSongsToPlaylist,
   Modal,
   ConfirmModal,
   BackBtn,
   SongList,
} from "../components";

import usePlaylistActions from "../hooks/usePlaylistActions";
import { SongItemSkeleton } from "../components/skeleton";
import EditPlaylist from "../components/modals/EditPlaylist";

export default function DashboardPlaylist() {
   // *** store
   const { theme } = useTheme();
   const { setErrorToast } = useToast();
   const { userSongs, adminSongs } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);

   // *** state
   const firstTimeRender = useRef(true);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<"edit" | "confirm" | "addSongs">();
   // for multiselect songItem
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
   const [isChecked, setIsChecked] = useState(false);

   // use hooks
   const {
      deletePlaylist,
      loading: playlistActionLoading,
      deleteManyFromPlaylist,
   } = usePlaylistActions({ admin: true });
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

   const handleDeleteManyFromPlaylist = async () => {
      try {
         await deleteManyFromPlaylist(selectedSongs, playlistSongs);
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
      setIsChecked(false);
      setSelectedSongs([]);
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
      playlistInfoContainer: "flex flex-col gap-[12px] justify-between ml-[12px]",
      songListContainer: "h-[50px] mb-[10px] flex gap-[20px] ] items-center border-b",
      countSongText: "text-[14px]] font-semibold text-gray-500 w-[100px]",
      ctaContainer: `flex justify-center gap-[12px] md:justify-start`,
      buttonAddSongContainer: "w-full text-center mt-[30px]",
   };

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

   return (
      <div className="playlist-page min-  h-[100vh]">
         {/* head */}
         <BackBtn />

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
                     <p className="text-[16px]">{handleTimeText(playlistInStore?.time)}</p>
                     <p className="text-[14px] opacity-60">create by {playlistInStore.by}</p>
                  </div>

                  {/* cta */}
                  <div
                     className={`${classes.ctaContainer} ${usePlaylistLoading ? "opacity-60 pointer-events-none" : ""}`}
                  >
                     <Button
                        onClick={() => openModal("confirm")}
                        className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
                     >
                        <TrashIcon className="w-[25px]" />
                     </Button>

                     <Button
                        onClick={() => openModal("edit")}
                        className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
                     >
                        <PencilSquareIcon className="w-[25px]" />
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {/* songs list */}
         <div className="pb-[50px]">
            <div className={`${classes.songListContainer} border-${theme.alpha}`}>
               {usePlaylistLoading && <Skeleton className="h-[20px] w-[80px]" />}

               {!usePlaylistLoading && (
                  <>
                     {!isChecked ? (
                        <p className={classes.countSongText}>{songCount + " songs"}</p>
                     ) : (
                        <p className={classes.countSongText}>{selectedSongs.length + " selected"}</p>
                     )}
                  </>
               )}
               {isChecked && playlistSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongs(playlistSongs)}
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
                           setIsChecked(false);
                           setSelectedSongs([]);
                        }}
                        className={`p-[5px]`}
                     >
                        <XMarkIcon className="w-[20px]" />
                     </Button>
                  </>
               )}
            </div>

            {usePlaylistLoading && SongItemSkeleton}

            {!usePlaylistLoading && !!playlistSongs.length && (
               <SongList
                  inAdmin
                  inPlaylist={playlistInStore}
                  songs={playlistSongs}
                  handleSetSong={() => {}}
                  activeExtend={songInStore.song_in.includes(playlistInStore.name)}
               />
            )}

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
               {modalComponent === "edit" && (
                  <EditPlaylist isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} playlist={playlistInStore} />
               )}
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
                  <AddSongsToPlaylist
                     admin
                     theme={theme}
                     setIsOpenModal={setIsOpenModal}
                     setPlaylistSongs={setPlaylistSongs}
                     playlist={playlistInStore}
                     playlistSongs={playlistSongs}
                  />
               )}
            </Modal>
         )}
      </div>
   );
}

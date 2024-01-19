import {
   ArrowPathIcon,
   PencilSquareIcon,
   PlayIcon,
   PlusCircleIcon,
   QueueListIcon,
   StopIcon,
   TrashIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";

import { Song } from "../types";

import { useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { SongIn, SongWithSongIn } from "../store/SongSlice";
import { useTheme, useSongsStore, useToast, useActuallySongs, selectAllSongStore, setSong } from "../store";
import { usePlaylistDetail } from "../hooks";
import { handleTimeText } from "../utils/appHelpers";
import {
   PlaylistItem,
   Button,
   Skeleton,
   AddSongsToPlaylist,
   Modal,
   ConfirmModal,
   SongList,
   BackBtn,
} from "../components";

import usePlaylistActions from "../hooks/usePlaylistActions";
import EditPlaylist from "../components/modals/EditPlaylist";
import { SongListProvider } from "../store/SongListContext";

type ModalName = "edit" | "confirm" | "addSongs";

export default function PlaylistDetail() {
   // use store
   const dispatch = useDispatch();

   const { userSongs } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);

   // state
   const firstTimeRender = useRef(true);
   const [isChecked, setIsChecked] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
   const [modalComponent, setModalComponent] = useState<ModalName>();

   // use hooks
   const params = useParams();
   const { theme } = useTheme();
   const { setErrorToast } = useToast();
   const { setActuallySongs, actuallySongs } = useActuallySongs();
   const {
      deletePlaylist,
      loading: playlistActionLoading,
      deleteManyFromPlaylist,
      deleteSongFromPlaylist,
   } = usePlaylistActions({});

   const {
      playlistSongs,
      loading: usePlaylistLoading,
      setPlaylistSongs,
   } = usePlaylistDetail({
      firstTimeRender,
      playlistInStore,
      songInStore,
   });

   const handleSetSong = (song: Song, index: number) => {
      // case user play user songs then play playlist song
      const newSongIn: SongIn = `playlist_${playlistInStore.id}`;
      if (songInStore.id !== song.id || songInStore.song_in !== newSongIn) {
         dispatch(
            setSong({
               ...song,
               currentIndex: index,
               song_in: newSongIn,
            })
         );

         if (songInStore.song_in !== newSongIn) {
            setActuallySongs(playlistSongs);
            console.log("setActuallySongs when playlist list");
         }
      }
   };

   const handleSelectAll = () => {
      if (selectedSongs.length < playlistSongs.length) setSelectedSongs(playlistSongs);
      else resetCheckedList();
   };

   const resetCheckedList = () => {
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const addSongsToQueue = () => {
      const newSelectedSongs = selectedSongs.map(
         (s) => ({ ...s, song_in: `playlist_${playlistInStore.id}` } as SongWithSongIn)
      );
      const newQueue = [...actuallySongs, ...newSelectedSongs];
      setActuallySongs(newQueue);
      console.log("setActuallySongs when add to song queuec");
   };

   const handlePlayPlaylist = () => {
      const firstSong = playlistSongs[0];

      if (songInStore.song_in.includes(params.name as string)) return;
      handleSetSong(firstSong, 0);
   };

   const handleDeleteSongFromPlaylist = async (song: Song) => {
      try {
         const newPlaylistSongs = await deleteSongFromPlaylist(song, playlistSongs);
         if (newPlaylistSongs) {
            setPlaylistSongs(newPlaylistSongs);
            if (songInStore.song_in === `playlist_${playlistInStore.id}`) {
               setActuallySongs(newPlaylistSongs);
               console.log("set actually songs");
            }
         }
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      }
   };

   const handleDeleteManyFromPlaylist = async () => {
      try {
         const newPlaylistSongs = await deleteManyFromPlaylist(selectedSongs, playlistSongs);
         if (newPlaylistSongs) {
            setPlaylistSongs(newPlaylistSongs);

            if (songInStore.song_in === `playlist_${playlistInStore.id}`) {
               setActuallySongs(newPlaylistSongs);
               console.log("set actually songs");
            }
         }
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      } finally {
         setIsChecked(false);
         setSelectedSongs([]);
      }
   };

   const handleDeletePlaylist = async () => {
      try {
         await deletePlaylist(playlistInStore);

         const audioEle = document.querySelector(".hd-mp3") as HTMLAudioElement;
         if (audioEle) audioEle.pause();
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
   const isOnMobile = useMemo(() => window.innerWidth < 800, [window.innerWidth]);

   const classes = {
      button: `${theme.content_bg} rounded-full`,
      playListTop: "w-full space-y-[12px] md:space-y-0 md:space-x-[12px] flex flex-col md:flex-row",
      playlistInfoContainer: `flex flex-col gap-[12px] md:justify-between`,
      infoTop: "flex justify-center items-center gap-[8px] md:flex-col md:items-start",
      songListContainer: "h-[50px] w-full mb-[10px] flex gap-[8px] max-[549px]:gap-[12px] items-center border-b",
      countSongText: "text-[14px]] font-semibold opacity-[.6] leading-[1]",
      ctaContainer: `flex justify-center gap-[12px] md:justify-start`,
      buttonAddSongContainer: "w-full text-center mt-[30px]",
   };

   const SongItemSkeleton = [...Array(4).keys()].map((index) => {
      return (
         <div className="flex p-[10px]" key={index}>
            <Skeleton className="h-[54px] w-[54px] ml-[28px] rounded-[4px]" />
            <div className="ml-[10px]">
               <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
               <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
            </div>
         </div>
      );
   });

   return (
      <div className="min-h-screen">
         <BackBtn />

         <div className={classes.playListTop}>
            {/* image */}
            <div className="w-full px-[20px] md:w-1/4 md:px-0">
               {usePlaylistLoading ? (
                  <Skeleton className="pt-[100%] rounded-[8px]" />
               ) : (
                  <PlaylistItem
                     data={playlistInStore}
                     active={songInStore.song_in === `playlist_${playlistInStore.id}`}
                     inDetail
                     theme={theme}
                  />
               )}
            </div>

            {/* desktop playlist info */}
            <div className={classes.playlistInfoContainer}>
               <div className={classes.infoTop}>
                  {usePlaylistLoading ? (
                     <>
                        <Skeleton className="h-[30px]  w-[200px]" />
                        <Skeleton className="hidden md:block h-[16px] w-[60px]" />
                        <Skeleton className="hidden md:block h-[16px] w-[200px]" />
                     </>
                  ) : (
                     <>
                        <h3 className="text-[30px] font-semibold leading-[1]">{playlistInStore.name}</h3>
                        {!isOnMobile && (
                           <p className="text-[16px] leading-[1]">{handleTimeText(playlistInStore?.time)}</p>
                        )}
                        <p className="hidden md:block opacity-60 leading-[1]">create by {playlistInStore.by}</p>
                     </>
                  )}
               </div>

               {/* cta */}
               <div className={`${classes.ctaContainer} ${usePlaylistLoading ? "opacity-60 pointer-events-none" : ""}`}>
                  <Button
                     onClick={handlePlayPlaylist}
                     className={`rounded-full px-[20px] py-[6px] ${theme.content_bg} ${
                        !playlistInStore.song_ids.length && "opacity-60 pointer-events-none"
                     }`}
                  >
                     Play
                     <PlayIcon className="ml-[5px] w-[25px]" />
                  </Button>

                  {playlistInStore.name && playlistInStore.by !== "admin" && (
                     <>
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
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* songs list */}
         <div className="pb-[50px] mt-[30px]">
            <div className={`${classes.songListContainer} overflow-x-auto overflow-y-hidden border-${theme.alpha}`}>
               {usePlaylistLoading && <Skeleton className="h-[16px] w-[90px]" />}

               {isChecked && (
                  <button onClick={handleSelectAll} className="ml-[10px]">
                     <StopIcon className="w-[18px]" />
                  </button>
               )}

               {!usePlaylistLoading && !!songCount && (
                  <p className={classes.countSongText}>{!isChecked ? songCount + " songs" : selectedSongs.length}</p>
               )}

               {isChecked && selectedSongs.length && (
                  <div className="ml-[12px] flex items-center gap-[8px]">
                     <Button
                        onClick={addSongsToQueue}
                        variant={"outline"}
                        size={"small"}
                        className={`border-${theme.alpha} flex-shrink-0 ${theme.side_bar_bg}`}
                     >
                        <QueueListIcon className="w-[20px] mr-[4px]" />
                        Add to songs queue
                     </Button>

                     {playlistInStore.by !== "admin" && (
                        <Button
                           onClick={() => handleDeleteManyFromPlaylist()}
                           variant={"outline"}
                           size={"small"}
                           className={`border-${theme.alpha} flex-shrink-0 ${theme.side_bar_bg}`}
                        >
                           {playlistActionLoading ? <ArrowPathIcon className="w-[20px] animate-spin" /> : "Remove"}
                        </Button>
                     )}

                     <Button onClick={resetCheckedList} className={`px-[5px]`}>
                        <XMarkIcon className="w-[20px]" />
                     </Button>
                  </div>
               )}
            </div>

            {usePlaylistLoading && SongItemSkeleton}

            {!usePlaylistLoading && !!playlistSongs.length && (
               <SongListProvider
                  setIsChecked={setIsChecked}
                  setSelectedSongs={setSelectedSongs}
                  isChecked={isChecked}
                  selectedSongs={selectedSongs}
               >
                  {playlistInStore.by === "admin" ? (
                     <SongList
                        songs={playlistSongs}
                        inPlaylist={playlistInStore}
                        handleSetSong={handleSetSong}
                        activeExtend={songInStore.song_in.includes(playlistInStore.id)}
                     />
                  ) : (
                     <SongList
                        songs={playlistSongs}
                        inPlaylist={playlistInStore}
                        handleSetSong={handleSetSong}
                        activeExtend={songInStore.song_in.includes(playlistInStore.id)}
                        deleteFromPlaylist={handleDeleteSongFromPlaylist}
                        playlistSongs={playlistSongs}
                        setPlaylistSongs={setPlaylistSongs}
                     />
                  )}
               </SongListProvider>
            )}

            {playlistInStore.by !== "admin" && !!userSongs.length && (
               <div
                  className={`${classes.buttonAddSongContainer} ${
                     playlistSongs.length === userSongs.length ? "opacity-60 pointer-events-none" : ""
                  }`}
               >
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
                  <EditPlaylist setIsOpenModal={setIsOpenModal} isOpenModal={isOpenModal} playlist={playlistInStore} />
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
                     theme={theme}
                     playlist={playlistInStore}
                     setIsOpenModal={setIsOpenModal}
                     setPlaylistSongs={setPlaylistSongs}
                     playlistSongs={playlistSongs}
                  />
               )}
            </Modal>
         )}
      </div>
   );
}

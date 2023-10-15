import {
   ChevronLeftIcon,
   PencilSquareIcon,
   PlayIcon,
   PlusCircleIcon,
   TrashIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";

import { Song } from "../types";

import { useCallback, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Status } from "../store/SongSlice";
import {
   useTheme,
   useSongsStore,
   useToast,
   useActuallySongs,
   useAuthStore,
   selectAllSongStore,
   setPlaylist,
   setSong,
} from "../store";
import { useSongItemActions, usePlaylistDetail } from "../hooks";
import {
   handleTimeText,
   generatePlaylistAfterChangeSongs,
   updateSongsListValue,
} from "../utils/appHelpers";
import {
   PlaylistItem,
   SongItem,
   Button,
   PopupWrapper,
   MobileSongItem,
   Skeleton,
   AddSongToPlaylistModal,
   Modal,
} from "../components";
import { confirmModal } from "../components/Modal";

import {
   handleSongWhenAddToPlaylist,
   handleSongWhenDeleteFromPlaylist,
   handleSongWhenDeletePlaylist,
} from "../utils/songItemHelper";

import { myDeleteDoc, mySetDoc, setUserPlaylistIdsDoc } from "../utils/firebaseHelpers";

import { routes } from "../routes";

export default function PlaylistDetail() {
   // for store
   const dispatch = useDispatch();
   const params = useParams();
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { setSuccessToast, setErrorToast } = useToast();
   const { setActuallySongs } = useActuallySongs();
   const { userSongs, userPlaylists, setUserPlaylists, setUserSongs, adminSongs } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);

   // component state
   const [loading, setLoading] = useState(false);
   const firstTimeRender = useRef(true);

   //  use hooks
   const navigate = useNavigate();
   const { playlistSongs, loading: usePlaylistLoading } = usePlaylistDetail({
      firstTimeRender,
      playlistInStore,
      songInStore,
   });

   const { setPlaylistDocAndSetUserPlaylists } = useSongItemActions();

   // for modal
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<"edit" | "confirm" | "addSongs">();

   // for multiselect songItem
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   // for edit playlist
   const [playlistName, setPlaylistName] = useState<string>(playlistInStore.name);

   const handleSetSong = (song: Song, index: number) => {
      // case user play user songs then play playlist song
      if (songInStore.id !== song.id || !songInStore.song_in.includes(playlistInStore.name)) {
         const newSongIn: Status["song_in"] =
            playlistInStore.by === "admin"
               ? `admin-playlist-${playlistInStore.name as string}`
               : `user-playlist-${playlistInStore.name as string}`;

         dispatch(
            setSong({
               ...song,
               currentIndex: index,
               song_in: newSongIn,
            })
         );

         if (!songInStore.song_in.includes(playlistInStore.name)) {
            // console.log(
            //    "set Songs",
            //    playlistSongs.map((s) => s.name)
            // );
            setActuallySongs(playlistSongs);
         }
      }
   };

   const handlePlayPlaylist = () => {
      const firstSong = playlistSongs[0];

      if (songInStore.song_in.includes(params.name as string)) return;
      handleSetSong(firstSong, 0);
   };

   const handleAddSongsToPlaylist = useCallback(
      async (selectSongs: Song[]) => {
         const newPlaylistSongs = [...playlistSongs, ...selectSongs];
         const newUserSongs = [...userSongs];
         const songsNeedToUpdateDoc: Song[] = [];

         // >>> handle song
         for (let song of selectSongs) {
            const { error, newSong } = handleSongWhenAddToPlaylist(song, playlistInStore);

            // check valid song after change
            if (error) {
               setErrorToast({ message: "handleSongWhenDeleteFromPlaylist error" });
               return;
            } else if (newSong) {
               songsNeedToUpdateDoc.push(newSong);
               updateSongsListValue(newSong, newUserSongs);
            }
         }

         // handle playlist
         const newPlaylist = generatePlaylistAfterChangeSongs({
            newPlaylistSongs,
            existingPlaylist: playlistInStore,
         });

         // check valid playlist data after change
         if (
            newPlaylist.count < 0 ||
            newPlaylist.time < 0 ||
            newPlaylist.song_ids.length === playlistInStore.song_ids.length
         ) {
            setErrorToast({ message: "New playlist data error" });
            return;
         }

         // local
         setUserSongs(newUserSongs);

         // >>> local and api
         await setPlaylistDocAndSetUserPlaylists({
            newPlaylist,
         });

         songsNeedToUpdateDoc.forEach(async (song) => {
            /// >>> api
            await mySetDoc({ collection: "songs", data: song, id: song.id });
         });

         // finish
         closeModal();
         setSuccessToast({ message: `${selectSongs.length} songs added` });
      },
      [selectedSongList, isOpenModal]
   );

   const deleteFromPlaylist = async (song: Song) => {
      if (!playlistInStore.song_ids) {
         setErrorToast({});
         return;
      }

      const newUserSongs = [...userSongs];
      const newPlaylistSongs = [...playlistSongs];

      // >>> handle song
      const { error, newSong } = handleSongWhenDeleteFromPlaylist(song, playlistInStore);

      if (error || !newSong) {
         setErrorToast({ message: "Handle song when delete from playlist error" });
         return;
      }
      updateSongsListValue(newSong, newUserSongs);

      // >>> handle playlist
      // eliminate 1 song
      const index = newPlaylistSongs.findIndex((item) => item.id === song.id);
      newPlaylistSongs.splice(index, 1);

      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playlistInStore,
      });

      // check valid playlist after change
      if (
         newPlaylist.count < 0 ||
         newPlaylist.time < 0 ||
         newPlaylist.song_ids.length === playlistInStore.song_ids.length
      ) {
         setErrorToast({ message: "New playlist data error" });
         return;
      }

      // >>> local
      setUserSongs(newUserSongs);

      // >>> api
      await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });
      await setPlaylistDocAndSetUserPlaylists({
         newPlaylist,
      });

      // finish
      setSuccessToast({ message: `'${song.name}' removed` });
   };

   const deleteManyFromPlaylist = async () => {
      if (!playlistInStore.song_ids) {
         setErrorToast({});
         return;
      }

      // if need to remove 1 song
      if (selectedSongList.length === 1) {
         return deleteFromPlaylist(selectedSongList[0]);
      }

      const newPlaylistSongs = [...playlistSongs];
      const newUserSongs = [...userSongs];
      const songsNeedToUpdateDoc: Song[] = [];

      // >>> handle song
      for (let song of selectedSongList) {
         // eliminate 1 song
         const index = newPlaylistSongs.findIndex((item) => item.id === song.id);
         newPlaylistSongs.splice(index, 1);

         const { error, newSong } = handleSongWhenDeleteFromPlaylist(song, playlistInStore);

         // update user songs
         if (error) {
            setErrorToast({ message: "handleSongWhenDeleteFromPlaylist error" });
         } else if (newSong) {
            songsNeedToUpdateDoc.push(newSong);
            updateSongsListValue(newSong, newUserSongs);
         }
      }

      // >>> handle playlist
      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playlistInStore,
      });

      // check valid playlist data after change
      if (
         newPlaylist.count < 0 ||
         newPlaylist.time < 0 ||
         newPlaylist.song_ids.length === playlistInStore.song_ids.length
      ) {
         setErrorToast({ message: "New playlist data error" });
         return;
      }

      // >>> local
      setUserSongs(newUserSongs);

      // >>> api
      songsNeedToUpdateDoc.forEach(async (song) => {
         console.log("update doc", song.name);
         // await mySetDoc({ collection: "songs", data: song, id: song.id });
      });

      await setPlaylistDocAndSetUserPlaylists({
         newPlaylist,
      });

      // finish
      setSuccessToast({ message: `${selectedSongList.length} songs removed` });
   };

   const handleDeletePlaylist = async () => {
      try {
         setLoading(true);
         const newUserPlaylists = [...userPlaylists];

         let songsResult: Song[] = [];
         let newUserSongs: Song[] = [];

         if (playlistSongs.length) {
            newUserSongs = [...userSongs];
            const { error, songsNeedToUpdate } = handleSongWhenDeletePlaylist(
               playlistInStore,
               playlistSongs
            );

            if (error) {
               closeModal();
               setErrorToast({});
               return;
            }

            songsResult = songsNeedToUpdate;
         }

         // update song doc and update user song
         if (songsResult.length) {
            for (let song of songsResult) {
               updateSongsListValue(song, newUserSongs);

               // api
               await mySetDoc({ collection: "songs", data: song, id: song.id });
            }
         }

         // eliminate 1 playlists
         const index = newUserPlaylists.findIndex((item) => item.id === playlistInStore.id);
         newUserPlaylists.splice(index, 1);

         // >>> local
         setUserPlaylists(newUserPlaylists, []);
         if (songsResult.length) {
            setUserSongs(newUserSongs);
         }

         // >>> api
         await myDeleteDoc({ collection: "playlist", id: playlistInStore.id });
         await setUserPlaylistIdsDoc(newUserPlaylists, userInfo);

         // >>> finish
         setLoading(false);
         setIsOpenModal(false);
         dispatch(
            setPlaylist({
               id: "",
               name: "",
               song_ids: [],
               time: 0,
               count: 0,
               by: "",
               image_by: "",
               image_file_path: "",
               image_url: "",
            })
         );
         setSuccessToast({ message: `${playlistInStore.name} deleted` });

         navigate(`${routes.Playlist}`);
      } catch (error) {
         setErrorToast({});
      }
   };

   const openModal = (name: "edit" | "confirm" | "addSongs") => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
      setIsCheckedSong(false);
      setSelectedSongList([]);
   };

   const songCount = useMemo(() => playlistSongs.length, [playlistSongs]);
   const isOnMobile = useMemo(() => window.innerWidth < 550, []);

   const classes = {
      addSongContainer: "pb-[50px] relative",
      addSongContent: "max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full max-[549px]:w-full",
      editContainer: "w-[700px] max-w-[90vw] max-h-[90vh]",
      input: "text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full",
      button: `${theme.content_bg} rounded-full`,
      playListTop: "w-full flex max-[549px]:flex-col max-[549px]:gap-[12px]",
      playlistInfoContainer:
         "ml-[15px] flex flex-col justify-between max-[549px]:ml-0 max-[549px]:mb-[30px] max-[549px]:gap-[12px]",
      songListContainer:
         "h-[50px] mb-[10px] flex gap-[20px] max-[549px]:gap-[12px] items-center border-b",
      countSongText: "text-[14px]] font-semibold text-gray-500 w-[100px]",

      buttonAddSongContainer: "w-full text-center mt-[30px]",
   };

   // playlistSongs, songInStore, isCheckedSong, selectedSongList, isOpenModal
   const renderPlaylistSongs = useMemo(() => {
      // console.log('render playlist songs', playlistSongs.map(s => s.name));

      return playlistSongs.map((song, index) => {
         const active =
            song.id === songInStore.id && songInStore.song_in.includes(playlistInStore.name);

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
                  isCheckedSong={isCheckedSong && !isOpenModal}
                  setIsCheckedSong={setIsCheckedSong}
                  selectedSongList={selectedSongList}
                  setSelectedSongList={setSelectedSongList}
                  deleteFromPlaylist={deleteFromPlaylist}
                  userInfo={userInfo}
                  userSongs={userSongs}
                  setUserSongs={setUserSongs}
                  onClick={() => handleSetSong(song, index)}
                  theme={theme}
                  active={active}
                  data={song}
                  inPlaylist
               />
            </div>
         );
      });
   }, [playlistInStore.name, songInStore, playlistSongs, isCheckedSong, selectedSongList]);

   const editComponent = (
      <div className={classes.editContainer}>
         <label htmlFor="" className="text-[18px] font-semibold">
            Name:
         </label>
         <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            type="text"
            className={`${classes.input} bg-${theme.alpha} ${
               theme.type === "light" ? "text-[#333]" : "text-white"
            }`}
         />

         <Button
            // onClick={() => handleAddSongsToPlaylist()}
            variant={"primary"}
            className={`${theme.content_bg} rounded-full self-end mt-[15px]`}
         >
            Save
         </Button>
      </div>
   );

   const confirmComponent = useMemo(
      () =>
         confirmModal({
            loading: loading,
            label: "Delete playlist ?",
            theme: theme,
            callback: handleDeletePlaylist,
            setOpenModal: setIsOpenModal,
         }),
      [loading, theme]
   );

   // for define skeleton
   const playlistSkeleton = (
      <div className="flex max-[549px]:flex-col max-[549px]:gap-[12px]">
         <div className="w-1/4 max-[549px]:w-full max-[549px]:px-[20px]">
            <Skeleton className="pt-[100%] rounded-[8px]" />
         </div>
         <div className="min-[550px]:ml-[15px] max-[549px]:flex max-[549px]:mb-[30px] justify-between">
            <Skeleton className="h-[30px]  w-[100px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[100px]" />

            {!isOnMobile && (
               <>
                  <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
                  <Skeleton className="h-[15px] mt-[9px] w-[200px]" />
               </>
            )}
         </div>
      </div>
   );

   const SongItemSkeleton = [...Array(4).keys()].map((index) => {
      return (
         <div className="flex p-[10px]" key={index}>
            <Skeleton className="h-[54px] w-[54px] ml-[33px] rounded-[4px]" />
            <div className="ml-[10px]">
               <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
               <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
            </div>
         </div>
      );
   });

   return (
      <>
         {isOnMobile && (
            <Link to={routes.Home} className="inline-flex items-center mb-[30px] hover:opacity-75">
               <button className="">
                  <ChevronLeftIcon className="w-[25px]" />
               </button>
               <span className="text-[20px] font-semibold leading-1">My songs</span>
            </Link>
         )}
         {/* head */}
         {usePlaylistLoading && playlistSkeleton}
         {!usePlaylistLoading && !!playlistInStore.name && (
            <div className={classes.playListTop}>
               {/* image */}
               <div className="w-1/4 max-[549px]:w-full max-[549px]:px-[20px]">
                  <PlaylistItem data={playlistInStore} inDetail theme={theme} />
               </div>

               {/* playlist info */}
               <div className={classes.playlistInfoContainer}>
                  <div className="max-[549px]:flex justify-between items-center gap-[12px]">
                     <h3 className="text-[20px] font-semibold max-[549px]:text-[30px] leading-1">
                        {playlistInStore.name}
                        <button onClick={() => openModal("edit")} className="p-[5px]">
                           <PencilSquareIcon className="w-[20px]" />
                        </button>
                     </h3>
                     <p className="text-[16px]">{handleTimeText(playlistInStore?.time)}</p>
                     <p className="text-[14px] opacity-60 max-[549px]:hidden">
                        create by {playlistInStore.by}
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* cta */}
         <div className="flex items-center mt-[15px] gap-[12px] max-[549px]:justify-center">
            <Button
               onClick={() => handlePlayPlaylist()}
               className={`rounded-full px-[20px] py-[6px] ${theme.content_bg} ${
                  !playlistInStore.song_ids.length && "opacity-60 pointer-events-none"
               }`}
            >
               Play
               <PlayIcon className="ml-[5px] w-[25px]" />
            </Button>
            <Button
               onClick={() => openModal("confirm")}
               className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
            >
               <TrashIcon className="w-[25px]" />
            </Button>
         </div>

         {/* songs list */}
         <div className="pb-[50px]">
            <div className={`${classes.songListContainer} border-${theme.alpha}`}>
               {usePlaylistLoading && <Skeleton className="h-[20px] w-[150px]" />}

               {!isCheckedSong ? (
                  <p className={classes.countSongText}>{songCount + " songs"}</p>
               ) : (
                  <p className={classes.countSongText}>{selectedSongList.length + " selected"}</p>
               )}
               {isCheckedSong && userSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongList(playlistSongs)}
                        variant={"primary"}
                        className={classes.button}
                     >
                        All
                     </Button>
                     <Button
                        onClick={() => deleteManyFromPlaylist()}
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

            {usePlaylistLoading && SongItemSkeleton}

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
            <Modal setOpenModal={closeModal}>
               <PopupWrapper theme={theme}>
                  {modalComponent === "edit" && editComponent}
                  {modalComponent === "confirm" && confirmComponent}
                  {modalComponent === "addSongs" && (
                     <AddSongToPlaylistModal
                        theme={theme}
                        handleAddSongsToPlaylist={handleAddSongsToPlaylist}
                        playlistSongs={playlistSongs}
                     />
                  )}
               </PopupWrapper>
            </Modal>
         )}
      </>
   );
}

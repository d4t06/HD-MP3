import { doc, getDoc, setDoc } from "firebase/firestore";
import {
   ArrowTrendingUpIcon,
   Bars3Icon,
   PencilSquareIcon,
   PlayIcon,
   PlusCircleIcon,
   TrashIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import {
   MouseEventHandler,
   useCallback,
   useMemo,
   useState,
   useEffect,
   useRef,
} from "react";
import {
   FloatingFocusManager,
   autoPlacement,
   autoUpdate,
   useClick,
   useDismiss,
   useFloating,
   useInteractions,
} from "@floating-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../store/ThemeContext";
import { selectAllSongStore, setPlaylist, setSong } from "../store/SongSlice";

import { Playlist, Song } from "../types";

import PlaylistItem from "../components/ui/PlaylistItem";
import SongListItem from "../components/ui/SongItem";
import Button from "../components/ui/Button";
import PopupWrapper from "../components/ui/PopupWrapper";
import Modal from "../components/Modal";
import {handleTimeText} from "../utils/appHelpers";
import { useSongsStore } from "../store/SongsContext";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import useSong from "../hooks/useSongs";
import { generatePlaylistAfterChangeSongs, updatePlaylistsValue } from "../utils/firebaseHelpers";
import { nanoid } from "nanoid";
import { useToast } from "../store/ToastContext";
import MobileSongItem from "../components/ui/MobileSongItem";
import Skeleton from "../components/skeleton";
import useSongItemActions from "../hooks/useSongItemActions";

export default function PlaylistDetail() {
   // for store
   const params = useParams();
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { setToasts } = useToast();
   const { loading: initialLoading, errorMsg, initial } = useSong();
   const {
      userData,
      adminSongs,
      userSongs,
      userPlaylists,
      setUserPlaylists,
      setUserSongs,
   } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);

   // use actions
   const { updatePlaylistAfterChange } = useSongItemActions();

   // component state
   const [getPlaylistLoading, setGetPlaylistLoading] = useState(false);
   const [PlaylistSongs, setPlaylistSongs] = useState<Song[]>([]);
   const firstTimeRender = useRef(true);
   const [getPlaylistErrorMsg, setGetPlaylistErrorMsg] = useState("");

   // for modal
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<
      "edit" | "confirm" | "addSongs"
   >();

   // for add songs to playlist
   const [isOpenPopup, setIsOpenPopup] = useState(false);
   // const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

   // for multiselect songListItem
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   // for edit playlist
   const [playlistName, setPlaylistName] = useState<string>(playlistInStore.name);

   // for floating-ui
   const { refs, floatingStyles, context } = useFloating({
      open: isOpenPopup,
      onOpenChange: setIsOpenPopup,
      middleware: [autoPlacement()],
      whileElementsMounted: autoUpdate,
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

   const handleSetSong = (song: Song, index: number) => {
      dispatch(
         setSong({
            ...song,
            currentIndex: index,
            song_in:
               playlistInStore.by != "admin"
                  ? `user-playlist-${playlistInStore.name}`
                  : `admin-playlist-${playlistInStore.name}`,
         })
      );
   };

   const handlePlayPlaylist = () => {
      const firstSong = PlaylistSongs[0];

      if (songInStore.song_in.includes(params.name as string)) return;
      handleSetSong(firstSong, 0);
   };

   const handleAddSongsToPlaylist = useCallback(async () => {
      // eliminate duplicate song
      const trueNewSongsList = selectedSongList.filter((song) => {
         const isAdded = playlistInStore.song_ids.find((id) => id === song.id);
         return !isAdded;
      });

      // get new songs list
      const newPlaylistSongs = [...PlaylistSongs, ...trueNewSongsList];
      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playlistInStore,
      });

      await updatePlaylistAfterChange({
         newPlaylist,
      });

      setToasts((t) => [
         ...t,
         {
            title: "success",
            id: nanoid(4),
            desc: `${trueNewSongsList.length} songs added`,
         },
      ]);

      handleCloseModal();
   }, [selectedSongList, isOpenModal]);

   const deleteFromPlaylist = async (song: Song) => {
      setIsOpenPopup(false);

      if (!playlistInStore.song_ids) {
         return;
      }
      const newPlaylistSongs = [...PlaylistSongs];
      newPlaylistSongs.splice(newPlaylistSongs.indexOf(song), 1);

      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playlistInStore,
      });

      await updatePlaylistAfterChange({
         newPlaylist,
      });
      setToasts((t) => [
         ...t,
         { title: "success", id: nanoid(4), desc: `${song.name} removed` },
      ]);
   };

   const deleteManyFromPlaylist = async () => {
      setIsOpenPopup(false);

      if (!playlistInStore.song_ids) {
         return;
      }

      // if need to remove 1 song
      if (selectedSongList.length === 1) {
         return deleteFromPlaylist(selectedSongList[0]);
      }

      const newPlaylistSongs = [...PlaylistSongs];
      for (let song of selectedSongList) {
         newPlaylistSongs.splice(newPlaylistSongs.indexOf(song), 1);
      }

      const newPlaylist = generatePlaylistAfterChangeSongs({
         newPlaylistSongs,
         existingPlaylist: playlistInStore,
      });

      await updatePlaylistAfterChange({
         newPlaylist,
      });

      setToasts((t) => [
         ...t,
         {
            title: "success",
            id: nanoid(4),
            desc: `${selectedSongList.length} songs removed`,
         },
      ]);
   };

   const handleDeletePlaylist: MouseEventHandler = async () => {
      try {
         setGetPlaylistLoading(true);

         // Delete the song doc
         // await deleteDoc(doc(db, "playlist", playlistId as string));

         setGetPlaylistLoading(false);
         setIsOpenModal(false);
      } catch (error) {
         console.log({ message: error });
      }
   };

   const handleOpenModal = (name: "edit" | "confirm" | "addSongs") => {
      setModalComponent(name);
      setSelectedSongList(PlaylistSongs);
      setIsOpenModal(true);
   };

   const handleCloseModal = () => {
      setSelectedSongList([]);
      setIsOpenModal(false);
   };

   const songCount = useMemo(() => PlaylistSongs.length, [PlaylistSongs]);

   const isOnMobile = useMemo(() => window.innerWidth < 550, []);

   // get playlist data
   const getPlaylist = useCallback(async () => {
      console.log("run getPlaylist after initial");
      try {
         setGetPlaylistLoading(true);
         const playlistSnap = await getDoc(
            doc(db, "playlist", `${params.name}_${userData.email}` as string)
         );
         if (playlistSnap.exists()) {
            const playlistData = playlistSnap.data() as Playlist;

            dispatch(setPlaylist(playlistData));
         } else {
            setGetPlaylistErrorMsg("playlist not found");
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         setGetPlaylistLoading(false);
      }
   }, [params, userData]);

   // // get playlist song
   const getPlaylistSongs = useCallback(() => {
      // console.log("get playlist songs check ids", playlistInStore.song_ids);

      let newSongs: Song[];
      let i = 0;
      switch (playlistInStore.by) {
         case "admin":
            const tarGetSongsList = [...adminSongs];

            newSongs = tarGetSongsList.filter((adminSong) => {
               if (i === playlistInStore.song_ids.length) return;

               const condition = playlistInStore.song_ids.find(
                  (songId) => songId === adminSong.id
               );

               if (condition) i += 1;
               return condition;
            });

            break;
         default:
            newSongs = userSongs.filter((useSong) => {
               if (i === playlistInStore.song_ids.length) return;

               const condition = playlistInStore.song_ids.find(
                  (songId) => songId === useSong.id
               );

               if (condition) i += 1;
               return condition;
            });
      }

      // console.log("get playlist songs check new songs", newSongs);

      setPlaylistSongs(newSongs);
      // setSelectedSongs(tarGetSongsList);
   }, [playlistInStore.song_ids, userSongs]);

   // for initial playlist data
   useEffect(() => {
      if (playlistInStore.name) {
         setGetPlaylistLoading(false);
         return;
      }
      if (!initial) return;

      getPlaylist();
   }, [initial]);

   // for get playlist songs
   useEffect(() => {
      if (!playlistInStore) return;
      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         return;
      }
      if (playlistInStore.song_ids.length) {
         getPlaylistSongs();
      }
   }, [playlistInStore.song_ids]);

   // for update playlist feature image
   useEffect(() => {
      if (firstTimeRender.current) return;
      if (!PlaylistSongs.length) return;

      const firstSongHasImage = PlaylistSongs.find((song) => song.image_url);

      if (
         !firstSongHasImage ||
         (playlistInStore.image_path &&
            playlistInStore.image_path === firstSongHasImage.image_url)
      )
         return;

      console.log("get playlist feature image");

      const newPlaylist: Playlist = {
         ...playlistInStore,
         image_path: firstSongHasImage.image_url,
      };

      const setPlaylistImageToDoc = async () => {
         try {
            await setDoc(doc(db, "playlist", playlistInStore.id), newPlaylist, {
               merge: true,
            });
         } catch (error) {
            console.log("error when set playlist image");
         }
      };

      setPlaylistImageToDoc();

      // get new user playlist
      const newUserPlaylists = [...userPlaylists];
      updatePlaylistsValue(newPlaylist, newUserPlaylists);

      // update playlistInStore first
      // because the user can be in playlist detail page
      dispatch(setPlaylist(newPlaylist));

      // update users playlist to context
      setUserPlaylists(newUserPlaylists, []);
   }, [PlaylistSongs]);

   // for defines jsx
   const addSongsComponent = (
      <>
         <div className="pb-[50px]  relative">
            <div className="max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto">
               <Button
                  onClick={() => handleAddSongsToPlaylist()}
                  variant={"primary"}
                  className={`rounded-full ${theme.content_bg} absolute bottom-0 right-15px`}
               >
                  Save
               </Button>
               {userSongs.map((song, index) => {
                  return (
                     <div key={index} className="w-full max-[549px]:w-full">
                        <MobileSongItem
                           isCheckedSong={true}
                           selectedSongList={selectedSongList}
                           setIsCheckedSong={setIsCheckedSong}
                           setSelectedSongList={setSelectedSongList}
                           theme={theme}
                           data={song}
                           active={false}
                           onClick={() => {}}
                        />
                     </div>
                  );
               })}
            </div>
         </div>
      </>
   );

   const editComponent = (
      <div className="w-[700px] max-w-[90vw] max-h-[90vh]">
         <label htmlFor="" className="text-[18px] font-semibold">
            Name:
         </label>
         <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            type="text"
            className={` text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full bg-${
               theme.alpha
            } ${theme.type === "light" ? "text-[#333]" : "text-white"}`}
         />

         <Button
            onClick={() => handleAddSongsToPlaylist()}
            variant={"primary"}
            className={`${theme.content_bg} rounded-full self-end mt-[15px]`}
         >
            Save
         </Button>
      </div>
   );

   const confirmComponent = useMemo(
      () => (
         <>
            <div className="w-[30vw]">
               <h1 className="text-[20px] font-semibold">Chắc chưa ?</h1>
               <p className="text-[red]">This action cannot be undone</p>

               <div className="flex gap-[10px] mt-[20px]">
                  <Button
                     isLoading={getPlaylistLoading}
                     className={`${theme.content_bg} rounded-full text-[14px]`}
                     variant={"primary"}
                     onClick={handleDeletePlaylist}
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
      [getPlaylistLoading, theme]
   );

   // for define skeleton
   const playlistSkeleton = (
      <div className="flex">
         <div className="w-1/4 max-[459px]:w-1/2">
            <Skeleton className="pt-[100%] rounded-[8px]" />
         </div>
         <div className="ml-[15px]">
            <Skeleton className="h-[30px]  w-[100px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
            <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
            <Skeleton className="h-[15px] mt-[9px] w-[200px]" />
         </div>
      </div>
   );

   const SongItemSkeleton = [...Array(4).keys()].map((index) => {
      return (
         <div className="flex p-[10px]" key={index}>
            <Skeleton className="h-[54px] w-[54px] ml-[27px] rounded-[4px]" />
            <div className="ml-[10px]">
               <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
               <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
            </div>
         </div>
      );
   });

   const classes = {
      button: `${theme.content_bg} rounded-full`,
   };

   if (getPlaylistErrorMsg) return <h1>{getPlaylistErrorMsg}</h1>;
   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <>
         {/* head */}
         {(getPlaylistLoading || initialLoading) && playlistSkeleton}
         {!getPlaylistLoading && !!playlistInStore.name && (
            <div className="w-full flex mb-[15px] max-[549px]:flex-col max-[549px]:gap-[12px]">
               {/* image */}
               <div className="w-1/4 max-[549px]:w-full">
                  <PlaylistItem
                     // onClick={() => {}}
                     data={playlistInStore}
                     inDetail
                     theme={theme}
                     setUserPlaylists={setUserPlaylists}
                     userData={userData}
                     userPlaylists={userPlaylists}
                  />
               </div>

               {/* playlist info */}
               <div className="ml-[15px] flex flex-col justify-between max-[549px]:ml-0 max-[549px]:gap-[12px]">
                  <div className="max-[549px]:flex items-center gap-[12px]">
                     <h3 className="text-[20px] font-semibold max-[549px]:text-[30px]">
                        {playlistInStore.name}
                        <button
                           onClick={() => handleOpenModal("edit")}
                           className="p-[5px]"
                        >
                           <PencilSquareIcon className="w-[20px]" />
                        </button>
                     </h3>
                     <p className="text-[16px]">{playlistInStore?.count} songs</p>
                     <p className="text-[16px]">
                        {handleTimeText(playlistInStore?.time)}
                     </p>
                     <p className="text-[14px] opacity-60 max-[549px]:hidden">
                        create by {playlistInStore.by}
                     </p>
                  </div>

                  {/* cta */}
                  <div className="flex items-center gap-[12px]">
                     <Button
                        onClick={() => handlePlayPlaylist()}
                        variant={"primary"}
                        className={`rounded-full ${theme.content_bg}`}
                     >
                        Play
                        <PlayIcon className="ml-[5px] w-[20px]" />
                     </Button>
                     {/* <Button
                        onClick={() => handlePlayPlaylist()}
                        variant={"primary"}
                        className={`rounded-full ${theme.content_bg}`}
                     >
                        Shuffle
                        <ArrowTrendingUpIcon className="ml-[5px] w-[20px]" />
                     </Button> */}

                     {/* {!isOnMobile && (
                        <button
                           {...getReferenceProps}
                           ref={refs.setReference}
                           className={`ml-[10px] p-[6px] rounded-full  bg-${theme.alpha}`}
                        >
                           <Bars3Icon className="w-[20px]" />
                        </button>
                     )} */}
                  </div>
               </div>
            </div>
         )}

         {/* songs list */}
         <div className="pb-[30px]">
            <div
               className={`flex gap-[20px] max-[549px]:gap-[12px] items-center border-b border-${theme.alpha} h-[50px] mb-[10px]`}
            >
               {(getPlaylistLoading || initialLoading) && (
                  <Skeleton className="h-[20px] w-[150px]" />
               )}

               {!isCheckedSong ? (
                  <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                     {songCount + " songs"}
                  </p>
               ) : (
                  <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                     {selectedSongList.length + " selected"}
                  </p>
               )}
               {isCheckedSong && userSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongList(PlaylistSongs)}
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

            {(getPlaylistLoading || initialLoading) && SongItemSkeleton}
            {!getPlaylistLoading &&
               !!PlaylistSongs.length &&
               PlaylistSongs.map((song, index) => {
                  const active =
                     song.id === songInStore.id &&
                     songInStore.song_in.includes(playlistInStore.name);

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
                        <SongListItem
                           isCheckedSong={isCheckedSong && !isOpenModal}
                           setIsCheckedSong={setIsCheckedSong}
                           selectedSongList={selectedSongList}
                           setSelectedSongList={setSelectedSongList}

                           deleteFromPlaylist={deleteFromPlaylist}
                           userSongs={userSongs}
                           setUserSongs={setUserSongs}
                           theme={theme}
                           onClick={() => handleSetSong(song, index)}
                           active={active}
                           data={song}
                           inPlaylist
                        />
                     </div>
                  );
               })}

            <div className="w-full text-center mt-[15px]">
               <Button
                  onClick={() => handleOpenModal("addSongs")}
                  className={`${theme.content_bg} rounded-full`}
                  variant={"primary"}
               >
                  <PlusCircleIcon className="w-[30px] mr-[5px]" />
                  Thêm bài hát
               </Button>
            </div>
         </div>

         {/* popup */}
         {isOpenPopup && (
            <FloatingFocusManager modal={false} context={context}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <PopupWrapper {...getFloatingProps} theme={theme}>
                     <div className="w-[150px]">
                        <Button
                           onClick={() => handleOpenModal("edit")}
                           className={`${theme.content_hover_text}`}
                           variant={"list"}
                        >
                           <PencilSquareIcon className="w-[18px] mr-[5px]" />
                           Edit playlist
                        </Button>
                        <Button
                           onClick={() => handleOpenModal("confirm")}
                           className={`${theme.content_hover_text}`}
                           variant={"list"}
                        >
                           <TrashIcon className="w-[18px] mr-[5px]" />
                           Trash
                        </Button>
                     </div>
                  </PopupWrapper>
               </div>
            </FloatingFocusManager>
         )}

         {/* modal */}
         {isOpenModal && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>
                  {modalComponent === "edit" && editComponent}
                  {modalComponent === "confirm" && confirmComponent}
                  {modalComponent === "addSongs" && addSongsComponent}
               </PopupWrapper>
            </Modal>
         )}
      </>
   );
}

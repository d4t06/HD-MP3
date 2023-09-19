import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import {
   Bars3Icon,
   PencilSquareIcon,
   PlayPauseIcon,
   PlusCircleIcon,
   TrashIcon,
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
import SongListItem from "../components/ui/SongListItem";
import Button from "../components/ui/Button";
import PopupWrapper from "../components/ui/PopupWrapper";
import Modal from "../components/Modal";
import MySongsTabs from "../components/MySongsTabs";
import handleTimeText from "../utils/handleTimeText";
import { useSongsStore } from "../store/SongsContext";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import useSong from "../hooks/useUserSong";
import { countSongList, updatePlaylistsValue } from "../utils/crud";
// import usePlaylistDetail from "../hooks/usePlaylistDetail";
// import { db } from "../config/firebase";

export default function PlaylistDetail() {
   // for store
   const params = useParams();
   const dispatch = useDispatch();
   const { theme } = useTheme();
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

   // component state
   const [getPlaylistLoading, setGetPlaylistLoading] = useState(false);
   const [playListSongs, setPlaylistSongs] = useState<Song[]>([]);
   const firstTimeRender = useRef(true);
   const [getPlaylistErrorMsg, setGetPlaylistErrorMsg] = useState("");

   // for modal
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<
      "edit" | "confirm" | "addSongs"
   >();

   // for add songs to playlist
   const [isOpenPopup, setIsOpenPopup] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

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

   // for page data
   // const {
   //    playlistSongIndexes,
   //    playlistId,
   //    userSongs,
   //    loading: usePlaylistLoading,
   // } = usePlaylistDetail();

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
      const firstSong = playListSongs[0];
      handleSetSong(firstSong, 0);
   };

   const handleAddSongsToPlaylist = useCallback(async () => {
      // eliminate duplicate song
      const trueSongsList = selectedSongList.filter((song) => {
         const isAdded = playlistInStore.song_ids.find((id) => id === song.id);
         return !isAdded;
      });

      // get new songs list
      const newSongsList = [...playListSongs, ...trueSongsList];
      const { time, ids } = countSongList(newSongsList);

      // get added playlist
      const addedPlaylist: Playlist = {
         ...playlistInStore,
         song_ids: ids,
         count: ids.length,
         time,
      };

      // get new user playlists
      const newUserPlaylists = [...userPlaylists];
      updatePlaylistsValue(addedPlaylist, newUserPlaylists);

      // set playlist in redux
      dispatch(setPlaylist(addedPlaylist));

      // set playlists in context
      setUserPlaylists(newUserPlaylists, []);

      try {
         await setDoc(
            doc(db, "playlist", playlistInStore.id),
            { song_ids: ids, count: ids.length, time },
            { merge: true }
         );

         handleCloseModal();
      } catch (error) {
         console.log(error);
      }
   }, [selectedSongList, isOpenModal]);

   const deleteFromPlaylist = async (song: Song) => {
      if (!playlistInStore.song_ids) {
         return;
      }
      const newPlaylistSongs = [...playListSongs];
      newPlaylistSongs.splice(newPlaylistSongs.indexOf(song), 1);
      const { time, ids } = countSongList(newPlaylistSongs);

      const addedPlaylist: Playlist = {
         ...playlistInStore,
         time,
         song_ids: ids,
         count: ids.length,
      };
      // update userPlaylist
      const newUserPlaylists = [...userPlaylists];

      updatePlaylistsValue(addedPlaylist, newUserPlaylists);

      dispatch(setPlaylist(addedPlaylist));
      setUserPlaylists(newUserPlaylists, []);

      try {
         await setDoc(
            doc(db, "playlist", playlistInStore.id),
            { song_ids: ids, count: ids.length, time },
            { merge: true }
         );

         handleCloseModal();
      } catch (error) {
         console.log(error);
      }
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
      setSelectedSongList(playListSongs);
      setIsOpenModal(true);
   };

   const handleCloseModal = () => {
      setSelectedSongList([]);
      setIsOpenModal(false);
   };

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
      console.log("get playlist songs");

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

      console.log("get playlist songs check new songs", newSongs);

      setPlaylistSongs(newSongs);
      // setSelectedSongs(tarGetSongsList);
   }, [playlistInStore.song_ids, userSongs]);

   // for initial playlist data
   useEffect(() => {
      if (playlistInStore.name) return;
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
      if (!playListSongs.length) return;

      const firstSongHasImage = playListSongs.find((song) => song.image_path);

      if (
         !firstSongHasImage ||
         (playlistInStore.image_path &&
            playlistInStore.image_path === firstSongHasImage.image_path)
      )
         return;

      console.log("get playlist feature image");

      const newPlaylist: Playlist = {
         ...playlistInStore,
         image_path: firstSongHasImage.image_path,
      };

      const setPlaylistImageToDoc = async () => {
         try {
            await setDoc(
               doc(db, "playlist", playlistInStore.id),
               newPlaylist,
               { merge: true }
            );
         } catch (error) {
            console.log("error when set playlist image");
         }
      };

      setPlaylistImageToDoc();

      // get new user playlits
      const newUserPlaylists = [...userPlaylists];
      updatePlaylistsValue(newPlaylist, newUserPlaylists);

      // update playlistInStore first
      // because the user can be in playlist detail page
      dispatch(setPlaylist(newPlaylist));

      // update users playlist to context
      setUserPlaylists(newUserPlaylists, []);
   }, [playListSongs]);

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
                        <SongListItem
                           isCheckedSong={true}
                           selectedSongList={selectedSongList}
                           setIsCheckedSong={setIsCheckedSong}
                           setSelectedSongList={setSelectedSongList}
                           inList
                           theme={theme}
                           data={song}
                           active={songInStore.id === song.id}
                           onClick={() => {}}
                        />
                     </div>
                  );
               })}
               {/* <MySongsTabs
                  inList
                  selectedSongs={selectedSongs}
                  setSelectedSongs={setSelectedSongs}
               /> */}
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
         <div className="max-h-[60vh] overflow-auto">
            <div className="overflow-y-auto overflow-x-hidden no-scrollbar">
               <MySongsTabs
                  inList
                  selectedSongs={selectedSongs}
                  setSelectedSongs={setSelectedSongs}
               />
            </div>
         </div>
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

   if (errorMsg) return <h1>{errorMsg}</h1>;

   if (initialLoading) return <h1>Initial running...</h1>;

   if (getPlaylistLoading) return <h1>Get playlist...</h1>;

   if (getPlaylistErrorMsg) return <h1>{getPlaylistErrorMsg}</h1>;

   return (
      <>
         {/* head */}
         {!!playlistInStore.name && (
            <div className="w-full flex mb-[20px] pb-[20px] border-b">
               {/* image */}
               <div className="w-1/4">
                  <PlaylistItem
                     onClick={() => setIsOpenModal(true)}
                     data={playlistInStore}
                     inDetail
                     theme={theme}
                     setUserPlaylists={setUserPlaylists}
                     userData={userData}
                     userPlaylists={userPlaylists}
                  />
               </div>

               {/* playlist info */}
               <div className="ml-[15px] flex flex-col justify-between">
                  <div className="">
                     <h3 className="text-[20px] font-semibold">
                        {playlistInStore.name}
                        <button
                           onClick={() => handleOpenModal("edit")}
                           className="p-[5px]"
                        >
                           <PencilSquareIcon className="w-[20px]" />
                        </button>
                     </h3>
                     <p className="text-[14px]">{playlistInStore?.count} songs</p>
                     <p className="text-[14px]">
                        {handleTimeText(playlistInStore?.time)}
                     </p>
                     <p className="text-[14px] opacity-60">
                        create by {playlistInStore.by}
                     </p>
                  </div>
                  <div className="flex items-center">
                     <Button
                        onClick={() => handlePlayPlaylist()}
                        variant={"primary"}
                        className={`rounded-full ${theme.content_bg}`}
                     >
                        Play
                        <PlayPauseIcon className="ml-[5px] w-[20px]" />
                     </Button>

                     <button
                        {...getReferenceProps}
                        ref={refs.setReference}
                        className={`ml-[10px] p-[6px] rounded-full  bg-${theme.alpha}`}
                     >
                        <Bars3Icon className="w-[20px]" />
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* songs list */}
         <div className="pb-[30px]">
            {!!playListSongs.length &&
               playListSongs.map((song, index) => {
                  const active =
                     song.id === songInStore.id &&
                     songInStore.song_in.includes(playlistInStore.name);
                  return (
                     <div key={index} className="w-full -mx-[8px] max-[549px]:w-full">
                        <SongListItem
                           isCheckedSong={isCheckedSong && !isOpenModal}
                           selectedSongList={selectedSongList}
                           setIsCheckedSong={setIsCheckedSong}
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

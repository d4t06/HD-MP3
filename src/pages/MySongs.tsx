import {
   PlusCircleIcon,
   QueueListIcon,
   StopIcon,
   TrashIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Song, User } from "../types";

// store
import {
   useTheme,
   selectAllSongStore,
   useSongsStore,
   useToast,
   useAuthStore,
   setSong,
   useUpload,
   useActuallySongs,
} from "../store";

// utils
import { deleteSong, mySetDoc, setUserSongIdsAndCountDoc } from "../utils/firebaseHelpers";

// hooks
import { useSongs } from "../hooks";
// components
import {
   Empty,
   Modal,
   Button,
   //  SongItem,
   PlaylistItem,
   Skeleton,
   ConfirmModal,
   AddPlaylist,
   SongList,
   BackBtn,
} from "../components";

import { routes } from "../routes";
import { SongItemSkeleton, PlaylistSkeleton } from "../components/skeleton";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { initSongObject, sleep } from "../utils/appHelpers";
import { SongWithSongIn } from "../store/SongSlice";

type ModalName = "addPlaylist" | "confirm";
type Tab = "mine" | "favorite";
const TAB: Array<Tab> = ["mine", "favorite"];

export default function MySongsPage() {
   // use store
   const dispatch = useDispatch();
   const { userInfo, setUserInfo } = useAuthStore();

   const { song: songInStore } = useSelector(selectAllSongStore);
   const {
      playStatus: { isPlaying },
   } = useSelector(selectAllPlayStatusStore);
   const { userPlaylists, setUserSongs, userSongs } = useSongsStore();

   // state
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("addPlaylist");
   const [isChecked, setIsChecked] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

   const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
   const [songLoading, setSongLoading] = useState(false);

   // use hooks
   const { theme } = useTheme();
   const navigate = useNavigate();
   const { actuallySongs, setActuallySongs } = useActuallySongs();
   const { setErrorToast, setSuccessToast } = useToast();
   const { tempSongs, addedSongIds, status } = useUpload();
   const { loading: initialLoading, errorMsg, initial } = useSongs({});

   const [songTab, setSongTab] = useState<Tab>("mine");

   // define callback functions
   const handleOpenModal = (name: ModalName) => {
      setModalName(name);
      setOpenModal(true);
   };

   const handleGetFavorite = async () => {
      if (!userInfo || !userInfo.like_song_ids.length) {
         setErrorToast({});
         return;
      }

      try {
         const queryGetFavorites = query(
            collection(db, "songs"),
            where("id", "in", userInfo.like_song_ids)
         );
         const favoritesSnap = await getDocs(queryGetFavorites);
         let userLikeSongIdsChange = false;
         let userLikeSongIds: string[] = [];

         if (favoritesSnap.docs.length) {
            const favorites = favoritesSnap.docs.map(
               (s) => ({ ...s.data(), song_in: "favorite" } as SongWithSongIn)
            );

            setFavoriteSongs(favorites);
            //   handle update user like_song_ids when song have been remove
            if (favoriteSongs.length < userInfo.like_song_ids.length) {
               const newUserLikeSongIds = favorites.map((s) => s.id);
               userLikeSongIdsChange = true;
               userLikeSongIds = newUserLikeSongIds;
            }
            //   handle update user like_song_ids
         } else if (userInfo.like_song_ids) {
            userLikeSongIdsChange = true;
            userLikeSongIds = [];
         }

         if (userLikeSongIdsChange) {
            await mySetDoc({
               collection: "users",
               data: { like_song_ids: userLikeSongIds } as Partial<User>,
               id: userInfo.email,
               msg: ">>> api: update user like song ids",
            });
            setUserInfo({ like_song_ids: userLikeSongIds });
         }
      } catch (error) {
         console.log("error");
      } finally {
         setSongLoading(false);
      }
   };

   const handleSetTab = async (name: Tab) => {
      setSongTab(name);
      setSongLoading(true);
      resetCheckedList();
      if (name === "favorite") await handleGetFavorite();
      else {
         await sleep(300);
         setSongLoading(false);
      }
   };

   const handleSetFavoriteSong = (song: Song, index: number) => {
      if (
         songInStore.song_in !== "favorite" ||
         actuallySongs.length !== favoriteSongsFiltered.length
      ) {
         setActuallySongs(favoriteSongsFiltered);
         console.log("setActuallySongs");
      }

      if (songInStore.id !== song.id) {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
      }
   };

   const handleSetSong = (song: Song, index: number) => {
      // when user play playlist then play user songs
      if (songInStore.song_in !== "user" || actuallySongs.length !== userSongs.length) {
         setActuallySongs(userSongs);
         console.log("setActuallySongs");
      }

      if (songInStore.id !== song.id) {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
      }
   };

   const handleSelectAll = () => {
      if (selectedSongs.length < userSongs.length) setSelectedSongs(userSongs);
      else resetCheckedList();
   };

   const songCount = useMemo(() => {
      if (initialLoading || !initial) return 0;
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs, initial, initialLoading]);

   const favoriteSongsFiltered = useMemo(
      () => favoriteSongs.filter((s) => userInfo.like_song_ids.includes(s.id)),
      [userInfo.like_song_ids]
   );

   const resetCheckedList = () => {
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const closeModal = () => {
      setLoading(false);
      setOpenModal(false);
   };
   const addSongsToQueue = () => {
      const newQueue = [...actuallySongs, ...selectedSongs];
      setActuallySongs(newQueue);
      console.log("setActuallySongs");

      resetCheckedList();

      setSuccessToast({ message: "Songs added to queue" });
   };

   const handleDeleteSelectedSong = async () => {
      let newUserSongs = [...userSongs];
      const deletedIds: string[] = [];

      try {
         setLoading(true);
         // >>> api
         for (let song of selectedSongs) {
            await deleteSong(song);

            newUserSongs = newUserSongs.filter((s) => s.id !== song.id);
            deletedIds.push(song.id);
         }
         const userSongIds: string[] = newUserSongs.map((song) => song.id);
         await setUserSongIdsAndCountDoc({ songIds: userSongIds, userInfo });

         // handle song queue
         if (songInStore.song_in === "user") {
            const newSongQueue = actuallySongs.filter((s) => !deletedIds.includes(s.id));
            setActuallySongs(newSongQueue);
            console.log("setActuallySongs");
         }

         // handle song in store
         if (deletedIds.includes(songInStore.id)) {
            const emptySong = initSongObject({});
            dispatch(setSong({ ...emptySong, song_in: "", currentIndex: 0 }));
         }

         // handle user songs
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

   // define modals
   const ModalPopup: Record<ModalName, ReactNode> = {
      addPlaylist: <AddPlaylist setIsOpenModal={setOpenModal} theme={theme} userInfo={userInfo} />,
      confirm: (
         <ConfirmModal
            loading={loading}
            label={`Delete ${selectedSongs.length} songs ?`}
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

   useEffect(() => {
      if (!userInfo.like_song_ids.length) {
         if (songTab === "favorite") setSongTab("mine");
      }
   }, [userInfo.like_song_ids]);

   const classes = {
      playlistItem: "w-1/4 p-[8px] max-[549px]:w-1/2",
   };

   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <>
         <div className="pb-[30px] ">
            {window.innerWidth < 800 && <BackBtn />}
            <h3 className="text-[24px] font-bold">Playlist</h3>

            <div className="flex flex-row flex-wrap -mx-[8px]">
               {!!userPlaylists.length &&
                  !initialLoading &&
                  userPlaylists.map((playlist, index) => {
                     const active =
                        isPlaying &&
                        !!songInStore?.song_in &&
                        songInStore.song_in.includes(playlist.id);
                     return (
                        <div key={index} className={classes.playlistItem}>
                           <PlaylistItem active={active} theme={theme} data={playlist} />
                        </div>
                     );
                  })}
               {initialLoading && PlaylistSkeleton}
               {
                  <div className={`${classes.playlistItem} mb-[25px]`}>
                     <Empty
                        theme={theme}
                        className="pt-[100%]"
                        onClick={() => handleOpenModal("addPlaylist")}
                     />
                  </div>
               }
            </div>
         </div>

         {/* song list */}
         <div className="pb-[30px] max-[549px]:pb-[80px]">
            {/* title */}
            <div className="flex items-center justify-between">
               {/* for upload song */}
               <h3 className="text-[24px] font-bold">Songs</h3>
               <label
                  className={`${theme.content_bg} ${
                     status === "uploading" || initialLoading
                        ? "opacity-60 pointer-events-none"
                        : ""
                  } items-center hover:opacity-60 rounded-full flex px-[16px] py-[4px] cursor-pointer`}
                  htmlFor="song_upload"
               >
                  <PlusCircleIcon className="w-[20px] mr-[5px]" />
                  Upload
               </label>
            </div>

            {/* song list */}
            <div className={`flex gap-[8px] items-center h-[45px] border-b border-${theme.alpha}`}>
               {initialLoading && <Skeleton className="h-[20px] w-[150px]" />}

               {isChecked && (
                  <button onClick={handleSelectAll} className="ml-[10px]">
                     <StopIcon className="w-[18px]" />
                  </button>
               )}

               {/* checked song */}
               {!initialLoading && (
                  <p className="text-[14px] font-semibold opacity-[.6] leading-[1]">
                     {!isChecked ? (
                        <>
                           {songTab === "mine" ? (
                              <>{(songCount ? songCount : 0) + " songs"}</>
                           ) : (
                              favoriteSongs.length + " songs"
                           )}
                        </>
                     ) : (
                        selectedSongs.length
                     )}
                  </p>
               )}
               {isChecked && userSongs.length && (
                  <>
                     <Button
                        onClick={addSongsToQueue}
                        variant={"outline"}
                        size={"small"}
                        className={`border-${theme.alpha} ${theme.side_bar_bg} ml-[12px]`}
                     >
                        <QueueListIcon className="w-[20px] mr-[4px]" />
                        Add to queue
                     </Button>

                     <Button
                        onClick={() => handleOpenModal("confirm")}
                        variant={"outline"}
                        size={"small"}
                        className={`border-${theme.alpha} ${theme.side_bar_bg}`}
                     >
                        <TrashIcon className="w-[20px] mr-[4px]" />
                        Delete
                     </Button>

                     <Button onClick={resetCheckedList} className={`px-[5px]`}>
                        <XMarkIcon className="w-[20px]" />
                     </Button>
                  </>
               )}
            </div>

            <div className={`flex items-center gap-[10px] my-[10px]`}>
               {TAB.map((tab, index) => {
                  const active = songTab === tab;
                  return (
                     <button
                        key={index}
                        onClick={() => handleSetTab(tab)}
                        className={`text-[14px] font-[500] px-[10px]  py-[4px] rounded-[99px] ${
                           active ? theme.content_bg : `${theme.content_border} border`
                        } ${
                           !active && !userInfo.like_song_ids.length
                              ? "opacity-[.2] pointer-events-none"
                              : ""
                        }`}
                     >
                        {tab === "mine" ? "My songs" : "Favorite"}
                     </button>
                  );
               })}
            </div>
            <div className="min-h-[50vh]">
               {(initialLoading || songLoading) && SongItemSkeleton}

               {!initialLoading && !songLoading && (
                  <>
                     {songTab === "mine" && !!songCount && (
                        <SongList
                           handleSetSong={handleSetSong}
                           activeExtend={
                              songInStore.song_in === "user" || songInStore.song_in === "favorite"
                           }
                           isChecked={isChecked}
                           setIsChecked={setIsChecked}
                           setSelectedSongs={setSelectedSongs}
                           selectedSongs={selectedSongs}
                           songs={userSongs}
                           tempSongs={tempSongs}
                           addedSongIds={addedSongIds}
                        />
                     )}

                     {songTab === "favorite" && !!favoriteSongsFiltered.length && (
                        <SongList
                           activeExtend={
                              songInStore.song_in === "user" || songInStore.song_in === "favorite"
                           }
                           handleSetSong={handleSetFavoriteSong}
                           isChecked={isChecked}
                           songs={favoriteSongsFiltered}
                        />
                     )}
                  </>
               )}
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

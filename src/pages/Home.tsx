import { useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   ArrowRightOnRectangleIcon,
   ChevronRightIcon,
   InformationCircleIcon,
   MusicalNoteIcon,
   PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Song } from "../types";

import {
   selectAllSongStore,
   setSong,
   useTheme,
   useSongsStore,
   useAuthStore,
} from "../store";
import {
   SongItem,
   Button,
   LinkItem,
   MobileSongItem,
   Modal,
   Avatar,
   AppInfo,
   Appearance,
   ConfirmModal,
} from "../components";
// hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useSongs, useSongItemActions } from "../hooks";
// config
import { routes } from "../routes";
import { auth } from "../config/firebase";
import Skeleton, { SongItemSkeleton, MobileLinkSkeleton } from "../components/skeleton";

import { useAuthActions } from "../store/AuthContext";

export default function HomePage() {
   // use store
   const dispatch = useDispatch();
   const [loggedInUser, loading] = useAuthState(auth);
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { loading: useSongLoading } = useSongs();
   const { adminSongs, userPlaylists } = useSongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);

   // use hooks
   const songItemActions = useSongItemActions();
   const { logIn, logOut } = useAuthActions();


   // component states
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const modalName = useRef<"theme" | "info" | "confirm">("theme");

   // define callback functions
   const handleSetSong = (song: Song, index: number) => {
      if (songInStore.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: "admin" }));
   };

   const isOnMobile = useMemo(() => window.innerWidth < 800, []);


   //   methods
   const handleLogIn = async () => {
      try {
         await logIn();
      } catch (error) {
         console.log(error);
      } finally {
         setIsOpenModal(false);
      }
   };

   const handleSignOut = async () => {
      try {
         await logOut();
      } catch (error) {
         console.log("signOut error", { messsage: error });
      } finally {
         setIsOpenModal(false);
      }
   };

   const handleOpenModal = (name: typeof modalName.current) => {
      modalName.current = name;
      setIsOpenModal(true);
   };

   // define styles
   const classes = {
      songItemContainer: `w-full border-b border-${theme.alpha} last:border-none`,
      icon: `w-6 h-6 mr-2 inline`,
      popupWrapper: "w-[400px] max-w-[calc(90vw-40px)]",
      themeContainer: "overflow-auto no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
      themeList: "flex flex-row -mx-[10px] flex-wrap gap-y-[20px]",
      linkItem: `py-[10px] border-b border-${theme.alpha} last:border-none`,
   };

   // define jsx
   const renderAdminSongs = useMemo(() => {
      return adminSongs.map((song, index) => {
         const active = song.id === songInStore.id && songInStore.song_in === "admin";

         if (isOnMobile) {
            return (
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
            );
         }
         return (
            <SongItem
               theme={theme}
               onClick={() => handleSetSong(song, index)}
               active={active}
               key={index}
               data={song}
               userInfo={userInfo}
               isCheckedSong={isCheckedSong}
               userPlaylists={userPlaylists}
               selectedSongList={selectedSongList}
               setIsCheckedSong={setIsCheckedSong}
               setSelectedSongList={setSelectedSongList}
               songItemActions={songItemActions}
            />
         );
      });
   }, [adminSongs, theme, songInStore, selectedSongList, isCheckedSong]);

   return (
      <>
         {/* mobile nav */}
         {isOnMobile && (
            <div className="pb-[20px]">
               <div className="flex flex-col gap-3 items-start ">
                  <h1 className="text-[24px] font-bold">Library</h1>
                  {userInfo.status === "loading" ? (
                     MobileLinkSkeleton
                  ) : (
                     <>
                        {userInfo.email ? (
                           <LinkItem
                              className={classes.linkItem}
                              to={routes.MySongs}
                              icon={
                                 <MusicalNoteIcon
                                    className={classes.icon + theme.content_text}
                                 />
                              }
                              label="All songs"
                              arrowIcon={
                                 <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                              }
                           />
                        ) : (
                           <Button
                              onClick={handleLogIn}
                              className={`${theme.content_bg} rounded-[4px] px-[40px]`}
                              variant={"primary"}
                           >
                              Login
                           </Button>
                        )}
                     </>
                  )}
               </div>
            </div>
         )}
         {/* admin song */}
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[10px]">Popular</h3>
            {useSongLoading && SongItemSkeleton}

            {!useSongLoading && (
               <>{!!adminSongs.length ? renderAdminSongs : "No songs jet..."}</>
            )}
         </div>

         {/* mobile setting */}
         {isOnMobile && (
            <div className="pb-[30px]">
               <h3 className="text-[24px] font-bold mb-[10px]">Setting</h3>
               <Avatar className="h-[65px] w-[65px]" />
               {loading ? (
                  <Skeleton className="my-[8px] h-[27px]" />
               ) : (
                  <p className="text-[18px] font-[500] my-[8px]">
                     {loggedInUser?.displayName || "Guest"}
                  </p>
               )}

               {loading ? (
                  [...Array(3).keys()].map(() => MobileLinkSkeleton)
               ) : (
                  <>
                     <LinkItem
                        className={classes.linkItem}
                        icon={<PaintBrushIcon className={classes.icon} />}
                        label="Theme"
                        onClick={() => handleOpenModal("theme")}
                     />
                     <LinkItem
                        className={classes.linkItem}
                        icon={<InformationCircleIcon className={classes.icon} />}
                        label="Info"
                        onClick={() => handleOpenModal("info")}
                     />
                     <LinkItem
                        className={classes.linkItem}
                        icon={<ArrowRightOnRectangleIcon className={classes.icon} />}
                        label="Logout"
                        onClick={() => handleOpenModal("confirm")}
                     />
                  </>
               )}
            </div>
         )}

         {isOpenModal && (
            <Modal theme={theme} setOpenModal={setIsOpenModal} classNames="w-[90vw]">
               {modalName.current === "confirm" && (
                  <ConfirmModal setOpenModal={setIsOpenModal} callback={handleSignOut} loading={false} theme={theme} label="Log out ?"/>
               )}
               {modalName.current === "info" && (
                  <AppInfo setIsOpenModal={setIsOpenModal} />
               )}
               {modalName.current === "theme" && (
                  <Appearance setIsOpenModal={setIsOpenModal} />
               )}
            </Modal>
         )}
      </>
   );
}

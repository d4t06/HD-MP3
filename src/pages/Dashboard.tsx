import { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "../store/ThemeContext";

import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { db } from "../config/firebase";

import {
   Button,
   Image,
   Modal,
   ConfirmModal,
   SongList,
} from "../components";

import { convertTimestampToString } from "../utils/appHelpers";
import { deleteSong } from "../utils/firebaseHelpers";
import {
   selectAllSongStore,
   setSong,
   useActuallySongsStore,
   useAuthStore,
   useSongsStore,
   useUpload,
} from "../store";
import { useInitSong } from "../hooks";
import Skeleton, { SongItemSkeleton } from "../components/skeleton";
import { useDispatch, useSelector } from "react-redux";
import PlaylistList from "../components/PlaylistList";
import useAdminPlaylistActions from "../hooks/useAdminPlaylistActions";

type Modal = "logout" | "add-playlist";

// manual run init
export default function DashBoard() {
   const dispatch = useDispatch();

   //  store
   const { theme } = useTheme();
   const { user, loading: userLoading } = useAuthStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { adminPlaylists, adminSongs, setAdminSongs } = useSongsStore();
   const { setActuallySongs, actuallySongs } = useActuallySongsStore();

   // state
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
   const [isChecked, setIsChecked] = useState(false);
   const [loading, setLoading] = useState(true);
   const [users, setUsers] = useState<User[]>([]);
   const [tab, setTab] = useState<"adminSongs" | "users">("adminSongs");

   const ranUseEffect = useRef(true);

   // use hooks
   const { addedSongIds, tempSongs, status } = useUpload();
   const { addAdminPlaylist, isFetching } = useAdminPlaylistActions();
   const {
      loading: initialLoading,
      initSongsAndPlaylists,
      initial,
   } = useInitSong({ admin: true });

   const songCount = useMemo(() => {
      return tempSongs.length + adminSongs.length;
   }, [tempSongs, adminSongs]);

   const getUsers = async () => {
      console.log(">>> api: get user");
      try {
         if (!user) return;

         setLoading(true);
         const queryGetUsers = query(
            collection(db, "users"),
            where("email", "!=", user.email as string)
         );
         const usersSnapshot = await getDocs(queryGetUsers);
         if (usersSnapshot.docs) {
            const usersList = usersSnapshot.docs.map((doc) => doc.data() as User);
            setUsers(usersList);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   const handleSetSong = (song: Song, index: number) => {
      if (songInStore.song_in !== "admin" || actuallySongs.length !== adminSongs.length) {
         setActuallySongs(adminSongs);
         console.log("setActuallySongs");
      }

      if (songInStore.id !== song.id) {
         dispatch(setSong({ ...song, currentIndex: index, song_in: "admin" }));
      }
   };

   const resetCheckedList = () => {
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const closeModal = () => setIsOpenModal("");

   const handleSelectAll = () => {
      selectedSongs.length < adminSongs.length
         ? setSelectedSongs(adminSongs)
         : setSelectedSongs([]);
   };

   //  no need to handle song queue
   const handleDeleteSongs = async () => {
      try {
         const newAdminSongs = [...adminSongs];

         setLoading(true);
         for (let song of selectedSongs) {
            await deleteSong(song);

            const index = adminSongs.findIndex((item) => item.id === song.id);
            newAdminSongs.splice(index, 1);
         }

         setActuallySongs(newAdminSongs);
         console.log("setActuallySongs");
         setAdminSongs(newAdminSongs);
      } catch (error) {
         console.log({ message: error });
      } finally {
         resetCheckedList();
         closeModal();
      }
   };

   const renderUsersList = () => {
      return users.map((user, index) => {
         return (
            <tr className={``} key={index}>
               <td className={classes.td}>
                  <div className="h-[44px] w-[44px] ml-[20px]">
                     <Image classNames="rounded-[4px]" src={user.photoURL} />
                  </div>
               </td>
               <td className={classes.td}>{user.display_name}</td>
               <td className={classes.td}>{user.email}</td>
               <td className={classes.td}>
                  {convertTimestampToString(user?.latest_seen)}
               </td>
            </tr>
         );
      });
   };

   const renderModal = useMemo(() => {
      switch (isOpenModal) {
         case "logout":
            return (
               <ConfirmModal
                  loading={loading}
                  label={`Delete '${selectedSongs.length} adminSongs'`}
                  desc={"This action cannot be undone"}
                  theme={theme}
                  callback={handleDeleteSongs}
                  close={closeModal}
               />
            );
      }
   }, [isOpenModal]);

   //  run initial
   useEffect(() => {
      const init = async () => {
         try {
            if (!initial) initSongsAndPlaylists();
            else {
               console.log("already initialized");
               setTimeout(() => setLoading(false), 200);
            }
         } catch (error) {
            console.log(error);
         }
      };

      if (ranUseEffect.current) {
         ranUseEffect.current = false;

         init();
      }
   }, []);

   useEffect(() => {
      if (userLoading) return;

      if (tab === "users" && !users.length) {
         getUsers();
      }
   }, [tab]);

   const classes = {
      button: `${theme.content_bg} rounded-full`,
      inActiveBtn: `bg-${theme.alpha}`,
      activeBtn: `${theme.content_bg}`,
      td: `py-[10px] my-[10px] border-${theme.alpha} border-b-[1px]`,
      th: `py-[5px]`,
      tableContainer: `border border-${theme.alpha} rounded-[4px]`,
      tableHeader: `border-b border-${theme.alpha} ${theme.side_bar_bg} flex items-center h-[50px] gap-[15px]`,
   };

   return (
      <>
         <div className={`container mx-auto pb-[60px]`}>
            {/* tabs */}
            <div className="mb-[20px]">
               <Button
                  onClick={() => setTab("adminSongs")}
                  className={`${
                     tab === "adminSongs" ? classes.activeBtn : classes.inActiveBtn
                  }  rounded-full`}
                  variant={"primary"}
               >
                  Songs
               </Button>
               <Button
                  onClick={() => setTab("users")}
                  className={` ${
                     tab === "users" ? classes.activeBtn : classes.inActiveBtn
                  } rounded-full ml-[10px]`}
                  variant={"primary"}
               >
                  Users
               </Button>
            </div>

            {/* content */}
            <div className="mt-[30px]">
               {tab === "adminSongs" && (
                  <>
                     {/* playlist */}
                     <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>

                     <PlaylistList
                        activeCondition={!!songInStore?.song_in}
                        loading={initialLoading}
                        playlist={adminPlaylists}
                        location="dashboard"
                        addPlaylist={addAdminPlaylist}
                        isFetching={isFetching}
                     />

                     {/* adminSongs */}
                     <div className="flex justify-between mb-[10px]">
                        <h3 className="text-2xl font-bold">Songs</h3>

                        <div className="flex items-center">
                           <label
                              className={`${theme.content_bg} ${
                                 status === "uploading" || initialLoading
                                    ? "opacity-60 pointer-events-none"
                                    : ""
                              } rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                              htmlFor="song_upload"
                           >
                              <PlusCircleIcon className="w-[20px] mr-[5px]" />
                              Upload
                           </label>
                        </div>
                     </div>

                     <div
                        className={`flex gap-[12px] items-center border-b border-${theme.alpha} h-[60px]`}
                     >
                        {initialLoading && <Skeleton className="h-[20px] w-[150px]" />}

                        {/* select song */}
                        {!initialLoading && (
                           <p className="text-[14px]] font-semibold text-gray-500 w-[100px]">
                              {!isChecked
                                 ? (songCount ? songCount : 0) + " songs"
                                 : selectedSongs.length + " selected"}
                           </p>
                        )}
                        {isChecked && (
                           <>
                              <Button
                                 onClick={handleSelectAll}
                                 variant={"primary"}
                                 className={classes.button}
                              >
                                 All
                              </Button>
                              <Button
                                 onClick={() => setIsOpenModal("logout")}
                                 variant={"primary"}
                                 className={classes.button}
                              >
                                 Delete
                              </Button>
                              <Button onClick={resetCheckedList} className={`px-[5px]`}>
                                 <XMarkIcon className="w-[25px]" />
                              </Button>
                           </>
                        )}
                     </div>

                     <div className="min-h-[50vh]">
                        {initialLoading && SongItemSkeleton}

                        {!initialLoading && (
                           <>
                              {!!songCount ? (
                                 <SongList
                                    inAdmin
                                    tempSongs={tempSongs}
                                    activeExtend={true}
                                    songs={adminSongs}
                                    handleSetSong={handleSetSong}
                                    addedSongIds={addedSongIds}
                                 />
                              ) : (
                                 <p className="text-center">...</p>
                              )}
                           </>
                        )}
                     </div>
                  </>
               )}

               {tab === "users" && (
                  <div className={classes.tableContainer}>
                     <table className="w-full">
                        <thead
                           className={`${theme.bottom_player_bg} w-full text-[14px] py-[4px]`}
                        >
                           <tr>
                              <th></th>
                              <th className="text-left py-[4px]">Name</th>
                              <th className="text-left py-[4px]">Email</th>
                              <th className="text-left py-[4px]">Latest Seen</th>
                           </tr>
                        </thead>
                        <tbody>{renderUsersList()}</tbody>
                     </table>
                  </div>
               )}
            </div>
         </div>

         {isOpenModal && (
            <Modal theme={theme} closeModal={closeModal}>
               {renderModal}
            </Modal>
         )}
      </>
   );
}

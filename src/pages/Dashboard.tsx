import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
// import { routes } from "../routes";

import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// utils
import { Song, User } from "../types";
import { convertTimestampToString } from "../utils/appHelpers";

// ui
import { XMarkIcon } from "@heroicons/react/24/outline";
import useUploadSongs from "../hooks/useUploadSongs";

import {
   Button,
   Image,
   Modal,
   DashboardSongItem,
   confirmModal,
} from "../components";

import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { deleteSong, myGetDoc } from "../utils/firebaseHelpers";
import { useAuthStore } from "../store";

// type ModalName = "ADD_PLAYLIST" | "MESSAGE";

// 2 time render
export default function DashBoard() {
   // use store
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();

   // state
   const [songs, setSongs] = useState<Song[]>([]);
   const [users, setUsers] = useState<User[]>([]);

   const [isOpenModal, setIsOpenModal] = useState(false);

   const [tab, setTab] = useState<"songs" | "users">("songs");
   // const [isAuthFinish, setIsAuthFinish] = useState(false);
   const [loading, setLoading] = useState(false);

   const [errorMsg, setErrorMsg] = useState<string>("");
   const [selectedList, setSelectedList] = useState<Song[]>([]);
   const [modalName, setModalName] = useState<"confirm" | "setting">("setting");

   const audioRef = useRef<HTMLAudioElement>(null);
   const selectAllBtnRef = useRef<HTMLInputElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const firstTempSong = useRef<HTMLDivElement>(null);

   // use hooks
   const navigate = useNavigate();
   const { addedSongIds, handleInputChange, status, tempSongs } = useUploadSongs({
      audioRef,
      admin: true,
      songs: songs,
      setSongs: setSongs,
      firstTempSong,
      inputRef,
   });

   const songCount = useMemo(() => {
      if (loading) return 0;
      return tempSongs.length + songs.length;
   }, [tempSongs, songs]);

   const getSongs = async () => {
      try {
         console.log("get songs");

         setLoading(true);

         const queryGetAdminSongs = query(
            collection(db, "songs"),
            where("by", "==", "admin")
         );
         const songsSnapshot = await getDocs(queryGetAdminSongs);

         if (songsSnapshot.docs) {
            const songsList = songsSnapshot.docs.map((doc) => {
               return { ...(doc.data() as Song), id: doc.id };
            });
            setSongs(songsList);
         }
      } catch (error) {
         console.log(error);
         setErrorMsg("get users list error");
      } finally {
         setLoading(false);
      }
   };

   const getUsers = async () => {
      console.log("get user");

      try {
         setLoading(true);
         const queryGetUsers = query(
            collection(db, "users"),
            where("email", "!=", userInfo?.email as string)
         );
         const usersSnapshot = await getDocs(queryGetUsers);

         if (usersSnapshot.docs) {
            const usersList = usersSnapshot.docs.map((doc) => doc.data() as User);

            console.log("get user", usersList);

            setUsers(usersList);
         }
      } catch (error) {
         console.log(error);
         setErrorMsg("get users list error");
      } finally {
         setLoading(false);
      }
   };

   const handleSelectAll = () =>
      selectedList.length ? setSelectedList([]) : setSelectedList(songs);

   const handleDeleteSongs = async () => {
      try {
         const newAdminSongs = [...songs];
         setLoading(true);
         for (let song of selectedList) {
            await deleteSong(song);

            const index = songs.findIndex((item) => item.id === song.id);
            newAdminSongs.splice(index, 1);
         }
         setLoading(false);
         setSongs(newAdminSongs);
      } catch (error) {
         console.log({ message: error });
      }
   };

   const handleOpenModal = (name: "confirm" | "setting") => {
      setModalName(name);
      setIsOpenModal(true);
   };

   const renderSongsList = () => {
      return songs.map((song, index) => {
         const isChecked = selectedList.length
            ? selectedList.some((selectedSong) => song.name === selectedSong.name)
            : false;
         return (
            <DashboardSongItem
               inProcess={false}
               key={index}
               data={song}
               adminSongs={songs}
               setAdminSongs={setSongs}
               isChecked={isChecked}
               selectedSongList={selectedList}
               setSelectedSongList={setSelectedList}
               theme={theme}
            />
         );
      });
   };

   const renderTempSongsList = () => {
      return tempSongs.map((song, index) => {
         const isAdded = addedSongIds.some((id) => {
            let condition = id === song.id;
            return condition;
         });

         if (index == 0) {
            return (
               <DashboardSongItem
                  ref={firstTempSong}
                  key={index}
                  data={song}
                  theme={theme}
                  inProcess={!isAdded}
               />
            );
         }

         return (
            <DashboardSongItem
               key={index}
               data={song}
               theme={theme}
               inProcess={!isAdded}
            />
         );
      });
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

   const dialogComponent = useMemo(
      () =>
         confirmModal({
            loading: loading,
            label: `Delete '${selectedList.length} songs'`,
            desc: "This action cannot be undone",
            theme: theme,
            callback: handleDeleteSongs,
            setOpenModal: setIsOpenModal,
         }),
      [loading, theme, selectedList]
   );

   useEffect(() => {
      if (userInfo.status === "loading") return;

      const auth = async () => {
         try {
            const userSnapshot = await myGetDoc({
               collection: "users",
               id: userInfo?.email as string,
            });
            const userData = userSnapshot.data() as User;

            if (userData.role !== "admin") return navigate(routes.Home);
         } catch (error) {
            console.log(error);
         }
      };

      if (!userInfo.email) return navigate(routes.Home);
      auth();

   }, [userInfo]);

   useEffect(() => {
      if (userInfo.status === "loading") return;

      if (tab === "users" && !users.length) getUsers();
      if (tab === "songs" && !songs.length) getSongs();
   }, [tab]);

   const classes = {
      inActiveBtn: `bg-${theme.alpha}`,
      activeBtn: `${theme.content_bg}`,
      td: `py-[10px] my-[10px] border-${theme.alpha} border-b-[1px]`,
      th: `py-[5px]`,
      tableContainer: `border border-${theme.alpha} rounded-[4px]`,
      tableHeader: `border-b border-${theme.alpha} ${theme.side_bar_bg} flex items-center h-[50px] gap-[15px]`,
   };

   return (
      <>
         <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept=".mp3"
            id="file"
            className="hidden"
            ref={inputRef}
         />
         <audio ref={audioRef} className="hidden" />

         {userInfo.status !== "loading" && (
            <div className={`container mx-auto pt-[30px] pb-[60px]`}>
               {/* content */}
               {/* tabs */}
               <div className="mb-[20px]">
                  <Button
                     onClick={() => setTab("songs")}
                     className={`${
                        tab === "songs" ? classes.activeBtn : classes.inActiveBtn
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

               {errorMsg && <p>{errorMsg}</p>}

               {/* content */}
               <div className={classes.tableContainer}>
                  <div className={classes.tableHeader}>
                     {!!selectedList.length ? (
                        <>
                           <h2 className="ml-[20px]">{selectedList.length} selected</h2>
                           <div className="flex items-stretch gap-[12px]">
                              <Button
                                 onClick={() => handleOpenModal("confirm")}
                                 variant={"primary"}
                                 className={`${classes.activeBtn} rounded-full`}
                              >
                                 Delete
                              </Button>

                              <Button
                                 onClick={() => setSelectedList([])}
                                 variant={"primary"}
                                 className={`${classes.activeBtn} rounded-full`}
                              >
                                 <XMarkIcon className="w-[20px]" />
                              </Button>
                           </div>
                        </>
                     ) : (
                        <label
                           className={`${theme.content_bg} ${
                              status === "uploading"
                                 ? "opacity-60 pointer-events-none"
                                 : ""
                           } rounded-full ml-[auto] mr-[10px] px-[20px] py-[4px] cursor-pointer`}
                           htmlFor="file"
                        >
                           Upload
                        </label>
                     )}
                  </div>

                  {tab === "songs" && (
                     <table className="w-full">
                        <thead className={`${theme.bottom_player_bg} w-full text-[14px]`}>
                           <tr>
                              <th className={`${classes.th} w-[10%]`}>
                                 <input
                                    className="scale-[1.2]"
                                    onChange={() => handleSelectAll()}
                                    ref={selectAllBtnRef}
                                    checked={
                                       songs.length
                                          ? songs.length === selectedList.length
                                          : false
                                    }
                                    type="checkbox"
                                 />
                              </th>
                              <th></th>

                              <th className={`${classes.th} text-left`}>Name</th>
                              <th className={`${classes.th} text-left`}>Singer</th>
                              <th className={`${classes.th} text-left`}>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {!!songCount ? (
                              <>
                                 {!!songs.length && renderSongsList()}
                                 {!!tempSongs.length && renderTempSongsList()}
                              </>
                           ) : loading ? (
                              <tr>
                                 <td colSpan={5} className={`${classes.td} text-center`}>
                                    <p>...Loading</p>
                                 </td>
                              </tr>
                           ) : (
                              <tr>
                                 <td colSpan={5} className={`${classes.td} text-center`}>
                                    <p>No song jet...</p>
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  )}
                  {tab === "users" && (
                     <table className="w-full">
                        <thead className="text-[14px]">
                           <tr>
                              <th></th>
                              <th className="text-left">Name</th>
                              <th className="text-left">Email</th>
                              <th className="text-left">Latest Seen</th>
                           </tr>
                        </thead>
                        <tbody>{renderUsersList()}</tbody>
                     </table>
                  )}
               </div>
            </div>
         )}

         {isOpenModal && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalName === "confirm" && dialogComponent}
            </Modal>
         )}
      </>
   );
}
1;

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
// import { routes } from "../routes";

import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
   useFloating,
   autoUpdate,
   offset,
   flip,
   shift,
   FloatingFocusManager,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
} from "@floating-ui/react";

// utils
import { Song, User } from "../types";
import { convertTimestampToString } from "../utils/appHelpers";

// ui
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useUploadSongs from "../hooks/useUploadSongs";

import { Button, Image, SettingMenu, Modal, PopupWrapper, DashboardSongItem, confirmModal } from "../components";


import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { deleteSong } from "../utils/firebaseHelpers";

// type ModalName = "ADD_PLAYLIST" | "MESSAGE";

// 2 time render
export default function DashBoard() {
   // use store
   const { theme } = useTheme();
   const [loggedInUser, userLoading] = useAuthState(auth);

   // state
   const [songs, setSongs] = useState<Song[]>([]);
   const [users, setUsers] = useState<User[]>([]);

   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const [tab, setTab] = useState<"songs" | "users">("songs");
   const [isAuthFinish, setIsAuthFinish] = useState(false);
   const [loading, setLoading] = useState(false);

   const [errorMsg, setErrorMsg] = useState<string>("");
   const [selectedList, setSelectedList] = useState<Song[]>([]);
   const [settingComp, setSettingComp] = useState<ReactNode>();
   const [modalName, setModalName] = useState<"confirm" | "setting">("setting");

   const audioRef = useRef<HTMLAudioElement>(null);
   const message = useRef<string>("");
   const selectAllBtnRef = useRef<HTMLInputElement>(null);

   // use hooks
   const navigate = useNavigate();
   const { addedSongIds, handleInputChange, status, tempSongs } = useUploadSongs({
      audioRef,
      message,
      admin: true,
      songs: songs,
      setSongs: setSongs,
   });

   // floating ui
   const { refs, floatingStyles, context } = useFloating({
      open: isOpenMenu,
      onOpenChange: setIsOpenMenu,
      placement: "bottom-end",
      middleware: [offset(20), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

   const songCount = useMemo(() => {
      if (userLoading) return 0;
      return tempSongs.length + songs.length;
   }, [tempSongs, songs]);

   const getSongs = async () => {
      try {
         console.log("get songs");

         setLoading(true);

         const queryGetAdminSongs = query(collection(db, "songs"), where("by", "==", "admin"));
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
            where("email", "!=", loggedInUser?.email as string)
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
         return <DashboardSongItem key={index} data={song} theme={theme} inProcess={!isAdded} />;
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
               <td className={classes.td}>{convertTimestampToString(user?.latest_seen)}</td>
               {/* <td className={classes.td}>
                  <div className="flex items-center gap-[5px]">
                     <Button variant={"circle"}>
                        <PencilSquareIcon className="w-[20px]" />
                     </Button>
                  </div>
               </td> */}
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
      if (userLoading) return;

      const auth = async () => {
         try {
            // const userSnapshot = await myGetDoc({ collection: "users", id: loggedInUser?.email as string });
            // const userData = userSnapshot.data() as User;

            // if (userData.role !== "admin") return navigate(routes.Home);

            setIsAuthFinish(true);
         } catch (error) {
            console.log(error);
         }
      };

      if (!loggedInUser) return navigate(routes.Home);

      auth();
   }, [loggedInUser]);

   useEffect(() => {
      if (userLoading || !isAuthFinish) return;

      if (tab === "users" && !users.length) getUsers();
      if (tab === "songs" && !songs.length) getSongs();
   }, [tab, isAuthFinish]);

   const text = `${theme.type === "light" ? "text-[#333]" : "text-white"}`;
   const classes = {
      inActiveBtn: `bg-${theme.alpha} ${text}`,
      activeBtn: `${theme.content_bg} ${text}`,
      td: `py-[10px] my-[10px] border-${theme.alpha} border-b-[1px]`,
      th: `py-[5px]`,
      tableContainer: `border border-${theme.alpha} rounded-[4px] mt-[30px]`,
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
         />
         <audio ref={audioRef} className="hidden" />

         {!userLoading && (
            <div className={`${theme.container} ${text} min-h-screen`}>
               {/* header */}
               <div className={`${theme.side_bar_bg} `}>
                  <div className="container mx-auto flex justify-between items-center h-[50px]">
                     <h1 className="text-[20px] uppercase">Zing dash board</h1>

                     <div className="flex items-center">
                        {loggedInUser?.displayName && (
                           <p className="text-[14px] mr-[8px]">{loggedInUser.displayName}</p>
                        )}
                        <div
                           className={`w-[30px] h-[30px] rounded-full overflow-hidden border-[#ccc] border`}
                        >
                           {loggedInUser?.photoURL && (
                              <img src={loggedInUser.photoURL!} className="w-full" alt="" />
                           )}
                        </div>
                        <button
                           ref={refs.setReference}
                           {...getReferenceProps()}
                           className={`flex ml-[12px] justify-center rounded-full items-center h-[30px] w-[30px] hover:brightness-75  ${
                              isOpenMenu && theme.content_text
                           } bg-${theme.alpha}`}
                        >
                           <Cog6ToothIcon className="w-[24px]" />
                        </button>
                     </div>
                  </div>
               </div>
               {/* content */}
               <div className="container mx-auto mt-[30px] pb-[60px]">
                  {/* tabs */}
                  <div className="">
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
                              className={`${theme.content_bg} ${text} ${
                                 status === "uploading" ? "opacity-60 pointer-events-none" : ""
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
            </div>
         )}

         {isOpenMenu && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <SettingMenu
                     loggedIn={!!loggedInUser?.email}
                     setIsOpenMenu={setIsOpenMenu}
                     setIsOpenSetting={setIsOpenModal}
                     setSettingComp={setSettingComp}
                     setModalName={setModalName}
                  />
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>
                  {modalName === "setting" && settingComp}
                  {modalName === "confirm" && dialogComponent}
               </PopupWrapper>
            </Modal>
         )}
      </>
   );
}
1;

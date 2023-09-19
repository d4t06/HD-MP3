import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { routes } from "../routes";

import { auth, db, store } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteObject, ref } from "firebase/storage";
import {
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";

// utils
import { Song, User } from "../types";
import { convertTimestampToString } from "../utils/convertTimestampToString";

// ui
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import useUploadSongs from "../hooks/useUploadSongs";

type ModalName = "ADD_PLAYLIST" | "MESSAGE";

// 2 time render
export default function DashBoard() {
   const { theme } = useTheme();
   const [loggedInUser, loading] = useAuthState(auth);

   const [isHasSong, setIsHasSong] = useState(false);
   const [fetchLoading, setFetchLoading] = useState(false);
   const [errorMsg, setErrorMsg] = useState<string>("");
   const [tab, setTab] = useState<"songs" | "users">("songs");
   const [songs, setSongs] = useState<Song[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [selectedList, setSelectedList] = useState<Song[]>([]);

   // for upload song
   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");
   const audioRef = useRef<HTMLAudioElement>(null);
   const message = useRef<string>("");
   const duplicatedFile = useRef<Song[]>([]);

   const handleOpenModal = (name: ModalName) => {
      setModalName(name);
      setOpenModal(true);
   };

   const { addedSongIds, handleInputChange, setTempSongs, status, tempSongs } =
      useUploadSongs({ audioRef, message, duplicatedFile, handleOpenModal, admin: true });

   const selectAllBtnRef = useRef<HTMLInputElement>(null);

   const navigate = useNavigate();

   const getSongs = async () => {
      try {
         console.log('get songs');
         
         setFetchLoading(true);

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
         setFetchLoading(false);
      }
   };

   const getUsers = async () => {
      console.log("get user");

      try {
         setFetchLoading(true);
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
         setFetchLoading(false);
      }
   };

   const handleSelect = (song: Song) => {
      let list = [...selectedList];

      const index = list.indexOf(song);

      // if no present
      if (index === -1) {
         list.push(song);

         // if present
      } else {
         list.splice(index, 1);
      }
      setSelectedList(list);
   };

   const handleSelectAll = () =>
      selectedList.length ? setSelectedList([]) : setSelectedList(songs);

   // const handleDeleted = async (song: Song) =>
   //    new Promise<void>(async (rs) => {
   //       // Create a reference to the file to delete
   //       const songFileRef = ref(store, song.file_name);

   //       // Delete the file
   //       await deleteObject(songFileRef);

   //       // Delete the song doc
   //       await deleteDoc(doc(db, "songs", song.id));

   //       if (song.lyric_id) {
   //          // Delete lyric doc
   //          await deleteDoc(doc(db, "lyrics", song.lyric_id));
   //       }
   //       rs();
   //    });

   const handleDeleteSongs = async () => {
      try {
         for (let song of selectedList) {
            // await handleDeleted(song);

            const songFileRef = ref(store, song.file_name);

            // Delete the file
            await deleteObject(songFileRef);

            // Delete the song doc
            await deleteDoc(doc(db, "songs", song.id));

            if (song.lyric_id) {
               // Delete lyric doc
               await deleteDoc(doc(db, "lyrics", song.lyric_id));
            }
         }

         // const newSongs = [...songs];
         // const index = songs.indexOf(song);
         // newSongs.splice(index, 1);

         // setSongs(newSongs);
         // console.log("set songs");
      } catch (error) {
         console.log({ message: error });
      }
   };

   const renderSongsList = () => {
      return songs.map((song, index) => {
         const isChecked = selectedList.length
            ? selectedList.some((selectedSong) => song.name === selectedSong.name)
            : false;
         return (
            <tr className={``} key={index}>
               <td className={`${classes.td} text-center`}>
                  <input
                     checked={isChecked}
                     onChange={() => handleSelect(song)}
                     className="scale-[1.2]"
                     type="checkbox"
                  />
               </td>
               <td className={classes.td}>
                  <div className="h-[44px] w-[44px]">
                     <img
                        src={song.image_path || "https://placehold.co/100x100/png"}
                        alt=""
                     />
                  </div>
               </td>
               <td className={classes.td}>{song.name}</td>
               <td className={classes.td}>{song.singer}</td>
               <td className={classes.td}>
                  <div className="flex items-center gap-[5px]">
                     <Button variant={"circle"}>
                        <TrashIcon className="w-[20px]" />
                     </Button>
                     <Button variant={"circle"}>
                        <PencilSquareIcon className="w-[20px]" />
                     </Button>
                  </div>
               </td>
            </tr>
         );
      });
   };

   const renderTempSongsList = () => {
      return tempSongs.map((song, index) => {
         const isAdded = addedSongIds.some((id) => {
            let condition = id === song.id;
            return condition;
         });
         return (
            <tr className={`${isAdded ? "opacity-60" : ""}`} key={index}>
               <td className={`${classes.td} text-center`}>
                  <input checked={false} className="scale-[1.2]" type="checkbox" />
               </td>
               <td className={classes.td}>
                  <div className="h-[44px] w-[44px]">
                     <img
                        src={song.image_path || "https://placehold.co/100x100/png"}
                        alt=""
                     />
                  </div>
               </td>
               <td className={classes.td}>{song.name}</td>
               <td className={classes.td}>{song.singer}</td>
               <td className={classes.td}>{!isAdded && <h1>...in process</h1>}</td>
            </tr>
         );
      });
   };

   const renderUsersList = () => {
      return users.map((user, index) => {
         console.log("check user", user);

         return (
            <tr className={``} key={index}>
               <td className={`${classes.td} text-center`}>
                  <input className="scale-[1.2]" type="checkbox" />
               </td>
               <td className={classes.td}>
                  <div className="h-[44px] w-[44px]">
                     <img
                        src={user.photoURL || "https://placehold.co/100x100/png"}
                        alt=""
                     />
                  </div>
               </td>
               <td className={classes.td}>{user.display_name}</td>
               <td className={classes.td}>{user.email}</td>
               <td className={classes.td}>
                  {convertTimestampToString(user?.latest_seen)}
               </td>
               <td className={classes.td}>
                  <div className="flex items-center gap-[5px]">
                     <Button variant={"circle"}>
                        <PencilSquareIcon className="w-[20px]" />
                     </Button>
                  </div>
               </td>
            </tr>
         );
      });
   };

   const checkIsHasSong = useCallback(() => {
      // console.log("call has song");
      setIsHasSong(!!tempSongs.length || !!songs.length);
      // return !!tempSongs.length || !!songs.length;
   }, [tempSongs, songs]);

   useEffect(() => {
      checkIsHasSong();

   }, [songs, tempSongs]);

   useEffect(() => {
      const auth = async () => {
         try {
            // get loggedInUser data
            const userSnapshot = await getDoc(
               doc(db, "users", loggedInUser?.email as string)
            );
            const userData = userSnapshot.data() as User;

            console.log(userData);

            // if loggeedInUser not an admin user
            if (userData.role !== "admin") return navigate(routes.Home);

            if (tab === "songs") getSongs();
         } catch (error) {
            console.log(error);
         }
      };

      // first render still loading and no has loggedInUser
      if (loading) return;

      //  second render if no user loggedIn
      // if (!loggedInUser) return navigate(routes.Home);
      // else auth();
   }, [loading]);

   useEffect(() => {
      if (tab === "users" && !users.length) getUsers();
      if (tab === "songs" && !songs.length) getSongs();
   }, [tab]);

   const classes = {
      button: `${theme.content_bg} rounded-full`,
      inActiveBtnBg: `bg-${theme.alpha}`,
      text: `${theme.type === "light" ? "text-[#333]" : "text-white"}`,
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

         {!loading && (
            <div className={`${theme.container} ${classes.text} min-h-screen`}>
               {/* header */}
               <div className={`${theme.side_bar_bg} `}>
                  <div className="container mx-auto flex justify-between items-center h-[50px]">
                     <h1 className="text-[20px] uppercase">Zing dash board</h1>
                     <div className="flex items-center">
                        {loggedInUser?.displayName && (
                           <p className="text-[14px] mr-[10px]">
                              {loggedInUser.displayName}
                           </p>
                        )}
                        <div
                           className={`w-[30px] h-[30px] rounded-full overflow-hidden border-[#ccc] border`}
                        >
                           {loggedInUser?.photoURL && (
                              <img
                                 src={loggedInUser.photoURL!}
                                 className="w-full"
                                 alt=""
                              />
                           )}
                        </div>
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
                           tab === "songs" ? theme.content_bg : classes.inActiveBtnBg
                        }  rounded-full`}
                        variant={"primary"}
                     >
                        Songs
                     </Button>
                     <Button
                        onClick={() => setTab("users")}
                        className={` ${
                           tab === "users" ? theme.content_bg : classes.inActiveBtnBg
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
                              <h2 className="ml-[20px]">
                                 {selectedList.length} selected
                              </h2>
                              <Button
                                 onClick={() => handleDeleteSongs()}
                                 variant={"primary"}
                                 className={classes.button}
                              >
                                 Delete
                              </Button>

                              <Button
                                 onClick={() => setSelectedList([])}
                                 variant={"primary"}
                                 className={classes.button}
                              >
                                 <XMarkIcon className="w-[20px]" />
                              </Button>
                           </>
                        ) : (
                           <label
                              className={`${theme.content_bg} ${
                                 status === "uploading"
                                    ? "opacity-60 pointer-events-none"
                                    : ""
                              } rounded-full ml-[auto] mr-[10px] px-[20px] py-[4px] text-white cursor-pointer`}
                              htmlFor="file"
                           >
                              Upload
                           </label>
                        )}
                     </div>
                     {tab === "songs" && (
                        <table className="w-full">
                           <thead
                              className={`${theme.bottom_player_bg} w-full text-[12px]`}
                           >
                              <tr>
                                 <th className={`${classes.th} w-[5%]`}>
                                    <input
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
                              {isHasSong ? (
                                 <>
                                    {!!tempSongs.length && renderTempSongsList()}
                                    {!!songs.length && renderSongsList()}
                                 </>
                              ) : fetchLoading ? (
                                 <tr>
                                    <td
                                       colSpan={5}
                                       className={`${classes.td} text-center`}
                                    >
                                       <p>...Loading</p>
                                    </td>
                                 </tr>
                              ) : (
                                 <tr>
                                    <td
                                       colSpan={5}
                                       className={`${classes.td} text-center`}
                                    >
                                       <p>No song jet...</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     )}
                     {tab === "users" && (
                        <table className="w-full">
                           <thead>
                              <tr>
                                 <th></th>
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
      </>
   );
}
1;

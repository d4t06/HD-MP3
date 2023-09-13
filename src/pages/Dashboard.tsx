import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useTheme } from "../store/ThemeContext";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Song, User } from "../types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { convertTimestampToString } from "../utils/convertTimestampToString";

// 2 time render
export default function DashBoard() {
   const { theme } = useTheme();
   const [loggedInUser, loading] = useAuthState(auth);

   const [tab, setTab] = useState<"songs" | "users">("songs");
   const [songs, setSongs] = useState<Song[]>([]);
   const [users, setUsers] = useState<User[]>([]);

   const navigate = useNavigate();

   const textColor = theme.type === "light" ? "text-[#333]" : "text-white";
   const inActiveBtnBg = `bg-${theme.alpha}`;

   const classes = {
      td: `py-[10px] my-[10px] boder-${theme.alpha} border-b-[1px]`
   }

   const getSongs = async () => {
      try {
         const queryGetAdminSongs = query(
            collection(db, "songs"),
            where("by", "==", "admin")
         );
         const songsSnapshot = await getDocs(queryGetAdminSongs);

         if (songsSnapshot.docs) {
            const songsList = songsSnapshot.docs.map((doc) => doc.data() as Song);
            setSongs(songsList);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const getUsers = async () => {
      console.log("get user");
      
      try {
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
      }
   };


   const renderSongsList = () => {
      return songs.map((song, index) => {
         return (
            <tr className={``} key={index}>
               <td className={classes.td}>
                  <input className="scale-[1.2]" type="checkbox" />
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

   const renderUsersList = () => {
      return users.map((user, index) => {
         console.log("check user" , user);
         
         return (
            <tr className={``} key={index}>
               <td className={classes.td}>
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
               <td className={classes.td}>{convertTimestampToString(user?.latest_seen)}</td>
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
            if (userData.role !== "admin") return navigate(routes.home);

            if (tab === "songs") getSongs();
         } catch (error) {
            console.log(error);
         }
      };

      // first render still loading and no has loggedInUser
      if (loading) return;      

      //  second render if no user loggedIn
      if (!loggedInUser) return navigate(routes.home);
      else auth();
   }, [loading]);

   useEffect(() => {
      if (tab === 'users' && !users.length) getUsers();
      if (tab === 'songs' && !songs.length) getSongs();
   }, [tab])

   return (
      <>
         {!loading && (
            <div className={`${theme.container} ${textColor} min-h-screen`}>
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
               <div className="container mx-auto mt-[30px]">
                  {/* tabs */}
                  <div className="">
                     <Button
                        onClick={() => setTab("songs")}
                        className={`${
                           tab === "songs" ? theme.content_bg : inActiveBtnBg
                        }  rounded-full`}
                        variant={"primary"}
                     >
                        Songs
                     </Button>
                     <Button
                        onClick={() => setTab("users")}
                        className={` ${
                           tab === "users" ? theme.content_bg : inActiveBtnBg
                        } rounded-full ml-[10px]`}
                        variant={"primary"}
                     >
                        Users
                     </Button>
                  </div>

                  {/* content */}
                  <div className="mt-[15px]">
                     {tab === "songs" && (
                        <table className="w-full">
                           <thead>
                              <tr>
                                 <th></th>
                                 <th></th>
                                 <th className="text-left">Name</th>
                                 <th className="text-left">Singer</th>
                                 <th className="text-left">Duration</th>
                              </tr>
                           </thead>
                           <tbody>{renderSongsList()}</tbody>
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

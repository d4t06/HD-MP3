import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "@/store/ThemeContext";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { db } from "../firebase";

import { Button, Image } from "../components";

import { convertTimestampToString } from "../utils/appHelpers";
import { useAuthStore, useSongsStore } from "../store";
import { useInitSong } from "../hooks";
import { useSelector } from "react-redux";
import PlaylistList from "../components/PlaylistList";
import { selectCurrentSong } from "@/store/currentSongSlice";
import DashboardSongList from "@/components/DashboardSongList";

// manual run init
export default function DashBoard() {
  // const dispatch = useDispatch();

  //  store
  const { theme } = useTheme();
  const { user, loading: userLoading } = useAuthStore();
  const { currentSong } = useSelector(selectCurrentSong);
  const { userPlaylists } = useSongsStore();

  // // state
  const [_loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<"userSongs" | "users">("userSongs");

  // use hooks
  const { loading: initialLoading, errorMsg } = useInitSong({ admin: true });

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

  const renderUsersList = () => {
    return users.map((user, index) => {
      return (
        <tr className={``} key={index}>
          <td className={classes.td}>
            <div className="h-[44px] w-[44px] ml-[20px]">
              <Image className="rounded-[4px]" src={user.photoURL} />
            </div>
          </td>
          <td className={classes.td}>{user.display_name}</td>
          <td className={classes.td}>{user.email}</td>
          <td className={classes.td}>{convertTimestampToString(user?.latest_seen)}</td>
        </tr>
      );
    });
  };

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
      <div className={`pt-10 pb-[calc(90px+40px)]`}>
        {/* tabs */}
        <div className="">
          <Button
            onClick={() => setTab("userSongs")}
            className={`${
              tab === "userSongs" ? classes.activeBtn : classes.inActiveBtn
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
          {tab === "userSongs" && (
            <>
              {/* playlist */}
              <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>

              <PlaylistList
                activeCondition={!!currentSong?.song_in}
                loading={initialLoading}
                playlist={userPlaylists}
                location="dashboard"
              />

              {/* userSongs */}
              <div className="mt-[30px] flex justify-between mb-[10px]">
                <h3 className="text-2xl font-bold">Songs</h3>

                <div className="flex items-center">
                  <label
                    className={`${theme.content_bg} ${
                      status === "uploading" || initialLoading ? "disable" : ""
                    } rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                    htmlFor="song_upload"
                  >
                    <PlusCircleIcon className="w-[20px] mr-[5px]" />
                    Upload
                  </label>
                </div>
              </div>

              {errorMsg && <p>Some thing went wrong</p>}
              {!errorMsg && <DashboardSongList initialLoading={initialLoading} />}
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

      {/* {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>} */}
    </>
  );
}

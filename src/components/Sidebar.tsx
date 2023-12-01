import {
  HomeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { routes } from "../routes";
import { Button, Skeleton } from "../components";
import { auth } from "../config/firebase";
import { useTheme, useAuthStore, setSong } from "../store";
import ScrollTop from "./ScrollTop";
import { useDispatch } from "react-redux";
import { initSongObject } from "../utils/appHelpers";
export default function Sidebar() {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { userInfo } = useAuthStore();
  const [loggedInUser] = useAuthState(auth);

  const location = useLocation();
  const navigate = useNavigate();

  const pauseSong = () => {
    const audioEle = document.querySelector(".hd-mp3") as HTMLAudioElement;
    audioEle.pause();

    console.log("check audio ele", audioEle);

    dispatch(setSong({ ...initSongObject({}), song_in: "", currentIndex: 0 }));
  };

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
    pauseSong();
  };

  // define skeleton
  const menuItemSkeletons = [...Array(2).keys()].map((index) => {
    return (
      <div key={index} className="pl-[14px] h-[44px] flex items-center">
        <Skeleton className="w-[25px] h-[25px] flex-shrink-0" />
        <Skeleton className="w-[80px] h-[19px] ml-[5px]" />
      </div>
    );
  });

  //  define styles
  const classes = {
    container: `w-[180px] relative h-full flex-shrink-0 border-r-[1px] h-screen ${theme.side_bar_bg} border-${theme.alpha}`,
    button: `w-full text-[14px] font-[500] ${theme.content_hover_text}`,
    text: theme.type === "light" ? "text-[#333]" : "text-white",
    icon: "w-[25px] mr-[5px]",
    menuItem:
      "w-full border-l-[4px] pl-[10px] h-[44px] inline-flex items-center",
    activeMenu: `${theme.content_text} ${theme.container} ${theme.content_border}`,
  };

  return (
    <div className={`${classes.container} ${classes.text}`}>
      <div className="px-[10px] h-[60px] flex items-center">
        <h1 className="text-[24px] font-semibold">
          HD
          <span className={`${theme.content_text} ml-[4px]`}>MP3</span>
        </h1>
      </div>

      <div className="flex flex-col items-start">
        {userInfo.status === "loading" && menuItemSkeletons}

        {userInfo.status !== "loading" && (
          <>
            <Link
              className={`${classes.menuItem} ${
                location.pathname === "/"
                  ? classes.activeMenu
                  : "border-transparent"
              }`}
              to={routes.Home}
            >
              <Button className={classes.button}>
                <HomeIcon className={classes.icon} />
                Discover
              </Button>
            </Link>
            {loggedInUser?.email && (
              <Link
                className={`${classes.menuItem}  ${
                  location.pathname.includes("mysongs")
                    ? classes.activeMenu
                    : "border-transparent"
                }`}
                to={routes.MySongs}
              >
                <Button className={classes.button}>
                  <MusicalNoteIcon className={classes.icon} />
                  My Song
                </Button>
              </Link>
            )}
            {userInfo.role === "admin" && (
              <Button
                onClick={handleNavigateToDashboard}
                className={`${classes.menuItem} ${classes.button} border-transparent`}
              >
                <ComputerDesktopIcon className={classes.icon} />
                Dashboard
              </Button>
            )}
          </>
        )}
      </div>

      <ScrollTop className="left-[50%] translate-x-[-50%] bottom-[80px] md:bottom-[100px]" />
    </div>
  );
}

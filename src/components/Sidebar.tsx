import {
  HomeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { Skeleton } from "../components";
import { useTheme, useAuthStore, useSongsStore } from "../store";
import ScrollTop from "./ScrollTop";
import { useDispatch } from "react-redux";
import { resetCurrentSong } from "@/store/currentSongSlice";
import { resetCurrentPlaylist } from "@/store/currentPlaylistSlice";
export default function Sidebar() {
  // store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { user, loading: userLoading } = useAuthStore();
  const { resetSongPlaylistStore } = useSongsStore();

  // hooks
  const location = useLocation();
  const navigate = useNavigate();

  const reset = () => {
    dispatch(resetCurrentSong());
    dispatch(resetCurrentPlaylist());
    resetSongPlaylistStore();
  };

  const handleNavigateToDashboard = () => {
    reset();
    navigate("/dashboard");
  };

  // define skeleton
  const menuItemSkeletons = [...Array(2).keys()].map((index) => {
    return (
      <div key={index} className="px-3 w-full h-[51px] flex items-center">
        <Skeleton className="w-[28px] h-[28px] mr-1 flex-shrink-0" />
        <Skeleton className="w-[100px] h-[30px]" />
      </div>
    );
  });

  //  define styles
  const classes = {
    container: `w-[180px] relative  flex-shrink-0 border-r-[1px] h-screen ${theme.side_bar_bg} border-${theme.alpha}`,
    navItem: `  px-3 py-2 leading-[2.2] font-playwriteCU flex items-center ${theme.content_hover_text}`,
    text: theme.type === "light" ? "text-[#333]" : "text-white",
    icon: "w-7 mr-1",
    link: "w-full border-l-[4px]",
    activeLink: `${theme.content_text} ${theme.container} ${theme.content_border}  `,
  };

  return (
    <div className={`${classes.container} ${classes.text}`}>
      <div className="px-[10px] h-[60px] flex items-center justify-center">
        <Link to={"/"} className="text-[24px] font-bold">
          HD
          <span className={`${theme.content_text} ml-[4px]`}>MP3</span>
        </Link>
      </div>
      <div className="flex flex-col items-start">
        {userLoading && menuItemSkeletons}

        {!userLoading && (
          <>
            <Link
              className={`${classes.link} ${
                location.pathname === "/" ? classes.activeLink : "border-transparent"
              }`}
              to={routes.Home}
            >
              <div className={classes.navItem}>
                <HomeIcon className={classes.icon} />
                <span>Discover</span>
              </div>
            </Link>

            {user && (
              <>
                <Link
                  className={`${classes.link}  ${
                    location.pathname.includes("mysongs")
                      ? classes.activeLink
                      : "border-transparent"
                  }`}
                  to={routes.MySongs}
                >
                  <div className={classes.navItem}>
                    <MusicalNoteIcon className={classes.icon} />
                    <span>My Song</span>
                  </div>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    to={"/dashboard"}
                    className={`${classes.link} border-transparent`}
                  >
                    <div
                      onClick={handleNavigateToDashboard}
                      className={` ${classes.navItem}`}
                    >
                      <ComputerDesktopIcon className={classes.icon} />
                      <span className="">Dashboard</span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </>
        )}
      </div>
      <ScrollTop className="left-[50%] translate-x-[-50%] bottom-[80px] md:bottom-[100px]" />
    </div>
  );
}

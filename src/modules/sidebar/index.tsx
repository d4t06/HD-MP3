import {
  HomeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  GlobeAsiaAustraliaIcon,
  SquaresPlusIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components";
import { useAuthContext, useThemeContext } from "@/stores";
export default function Sidebar() {
  // stores
  const { theme } = useThemeContext();
  const { user, loading: userLoading } = useAuthContext();

  // hooks
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  // define skeleton
  const menuItemSkeletons = [...Array(4).keys()].map((index) => {
    return (
      <div key={index} className="h-[55px] lg:h-[55px] w-full ske">
        <Skeleton className="w-6 h-6 flex-shrink-0" />
        <Skeleton className="w-[60px] h-[22px] md:h-[14px] md:mt-[2px] lg:h-[16px] lg:w-[70px]" />
      </div>
    );
  });

  const getActiveClasses = (condition: boolean) => {
    if (condition) return `${theme.content_text}`;
    return "";
  };

  //  define styles
  const classes = {
    container: `w-[80px] lg:w-[180px]  relative  flex-shrink-0 border-r-[1px] h-screen ${theme.side_bar_bg} border-${theme.alpha}`,
    linkList: `
      ${
        theme.type === "light"
          ? "hover:[&_div:not(.ske)]:bg-black/10"
          : "hover:[&_div:not(.ske)]:bg-white/10"
      }
      [&_div]:py-2
      [&_div]:leading-[2.2] 
      [&_div]:flex 
      [&_div]:flex-col 
      [&_div]:items-center
      [&_span]:text-xs
      [&_span]:font-medium

      lg:[&_div]:space-x-2 
      lg:[&_div]:px-3
      lg:[&_div]:flex-row 
      lg:[&_div]:items-center
      [&_svg]:w-6
      [&_a]:w-full
      lg:[&_span]:text-[14px]
      lg:[&_span]:inline-block
      `,
  };

  return (
    <div className={`${classes.container} ${theme.text_color}`}>
      <div className="px-[10px] h-[60px] flex items-center justify-center">
        <Link to={'/'} className="text-xl hidden lg:block font-[500]">
          HD
          <span className={`${theme.content_text} ml-[4px]`}>MP3</span>
        </Link>
      </div>
      <div className={`flex flex-col items-start ${classes.linkList}`}>
        {userLoading && menuItemSkeletons}

        {!userLoading && (
          <>
            <Link
              className={`
              ${getActiveClasses(location.pathname === "/")}
            `}
              to={"/"}
            >
              <div>
                <HomeIcon />
                <span>For You</span>
              </div>
            </Link>

            <Link
              className={`
              ${getActiveClasses(location.pathname.includes("/discover"))}
            `}
              to={"/discover"}
            >
              <div>
                <GlobeAsiaAustraliaIcon />
                <span>Discover</span>
              </div>
            </Link>

            <Link
              className={`
              ${getActiveClasses(location.pathname.includes("/category"))}
            `}
              to={"/category"}
            >
              <div>
                <SquaresPlusIcon />
                <span>Category</span>
              </div>
            </Link>

            <Link
              className={`
              ${getActiveClasses(location.pathname.includes("/trending"))}
            `}
              to={"/trending"}
            >
              <div>
                <ArrowTrendingUpIcon />
                <span>Trending</span>
              </div>
            </Link>

            {user && (
              <>
                <Link
                  className={`
                  ${getActiveClasses(location.pathname.includes("/my-music"))}`}
                  to={"/my-music"}
                >
                  <div>
                    <MusicalNoteIcon />
                    <span>My Song</span>
                  </div>
                </Link>

                {user.role === "ADMIN" && (
                  <Link to={"/dashboard"} className={`border-transparent`}>
                    <div onClick={handleNavigateToDashboard}>
                      <ComputerDesktopIcon />
                      <span className="">Dashboard</span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </>
        )}
      </div>
      {/* <ScrollTop className="left-[50%] translate-x-[-50%] bottom-[80px] md:bottom-[100px]" /> */}
    </div>
  );
}

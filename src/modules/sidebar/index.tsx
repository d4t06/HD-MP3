import {
  HomeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  GlobeAsiaAustraliaIcon,
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
  const menuItemSkeletons = [...Array(2).keys()].map((index) => {
    return (
      <div key={index} className="h-[78px] lg:h-[51px] w-full">
        <Skeleton className="lg:ml-1 w-[28px] h-[28px] flex-shrink-0" />
        <Skeleton className="w-[60px] h-[22px] lg:h-[28px] lg:w-[100px]" />
      </div>
    );
  });

  const getActiveClasses = (condition: boolean) => {
    if (condition)
      return `${theme.content_text}`;

    return "border-transparent";
  };

  //  define styles
  const classes = {
    container: `w-[80px] lg:w-[180px]  relative  flex-shrink-0 border-r-[1px] h-screen ${theme.side_bar_bg} border-${theme.alpha}`,
    linkList: `
      ${
        theme.type === "light"
          ? "hover:[&_div]:bg-black/10"
          : "hover:[&_div]:bg-white/10"
      }
      [&_div]:py-3
      [&_div]:leading-[2.2] 
      [&_div]:font-playwriteCU 
      [&_div]:flex 
      [&_div]:flex-col 
      [&_div]:items-center
      [&_div]:space-y-1 
      [&_span]:text-[10px]

      lg:[&_div]:space-y-0 
      lg:[&_div]:space-x-2 
      lg:[&_div]:px-3
      lg:[&_div]:flex-row 
      lg:[&_div]:items-center
      [&_svg]:w-7
      lg:[&_a]:border-l-[4px]
      [&_a]:w-full
      lg:[&_span]:text-[14px]
      `,
  };

  return (
    <div className={`hidden md:block ${classes.container} ${theme.text_color}`}>
      <div className="px-[10px] h-[60px] flex items-center justify-center">
        <div className="text-xl hidden lg:block font-[500]">
          HD
          <span className={`${theme.content_text} ml-[4px]`}>MP3</span>
        </div>
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
              ${getActiveClasses(location.pathname === "/discover")}
            `}
              to={"/discover"}
            >
              <div>
                <GlobeAsiaAustraliaIcon />
                <span>Discover</span>
              </div>
            </Link>

            {user && (
              <>
                <Link
                  className={`
                  ${getActiveClasses(location.pathname === "/my-music")}`}
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

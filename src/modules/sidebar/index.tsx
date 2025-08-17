import {
  HomeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  GlobeAsiaAustraliaIcon,
  SquaresPlusIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "@/components";
import { useAuthContext } from "@/stores";
import ScrollTop from "./_components/ScrollTop";
export default function Sidebar() {
  // stores
  const { user, loading: userLoading } = useAuthContext();

  // hooks
  const location = useLocation();

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
    if (condition) return `text-[--primary-cl]`;
    return "";
  };

  //  define styles
  const classes = {
    container: `w-[80px] lg:w-[160px] relative flex-shrink-0 h-screen bg-[--sidebar-collapse-cl] lg:bg-[--sidebar-cl] `,
    linkList: `
      hover:[&_div:not(.ske)]:bg-[--a-5-cl]
      [&_div]:py-1.5
      [&_div]:leading-[2.2] 
      [&_div]:flex 
      [&_div]:flex-col 
      [&_div]:items-center
      [&_span]:text-xs
      [&_span]:mt-[2px]
      [&_span]:font-semibold

      lg:[&_div]:py-2
      lg:[&_div]:pl-4
      lg:[&_span]:mt-0
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
    <div className={`${classes.container}`}>
      <div className="px-[10px] h-[80px] flex items-center justify-center">
        <Link
          to={"/"}
          className="bg-white dark:bg-[--layout-cl] w-12 flex h-12 rounded-full justify-center items-center"
        >
          <span className="text-[--primary-cl] text-xl font-bold translate-y-[1px]">
            :D
          </span>
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
                  <Link
                    to={"/dashboard"}
                    target="_blank"
                    className={`border-transparent`}
                  >
                    <div>
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
      <ScrollTop className="left-[50%] translate-x-[-50%] bottom-[80px] md:bottom-[100px]" />
    </div>
  );
}

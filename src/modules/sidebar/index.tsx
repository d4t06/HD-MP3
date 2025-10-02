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
import { pubicRouteMap } from "@/routes";
import { ReactNode } from "react";

const routeList = [
  {
    path: pubicRouteMap.discorver,
    title: "Discover",
    icon: <GlobeAsiaAustraliaIcon />,
  },

  {
    path: pubicRouteMap.catogory,
    title: "Category",
    icon: <SquaresPlusIcon />,
  },
  {
    path: pubicRouteMap.trending,
    title: "Trending",
    icon: <ArrowTrendingUpIcon />,
  },
];

function LinkItem({
  active,
  children,
  to,
}: {
  children: ReactNode;
  to: string;
  active: boolean;
}) {
  return (
    <Link
      className={`sidebar-item
              ${active ? "text-[--primary-cl]" : ""}
            `}
      to={to}
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  // stores
  const { user, loading: userLoading } = useAuthContext();

  // hooks
  const location = useLocation();

  // define skeleton
  const menuItemSkeletons = [...Array(4).keys()].map((index) => {
    return (
      <div key={index} className="sidebar-item">
        <Skeleton className="w-6 h-6 flex-shrink-0" />
        <Skeleton className="w-[60px] h-[22px] md:h-[14px] md:mt-1 lg:h-[16px] lg:w-[70px]" />
      </div>
    );
  });

  //  define styles
  const classes = {
    container: `w-[80px] lg:w-[160px] relative flex-shrink-0 h-screen bg-[--sidebar-collapse-cl] lg:bg-[--sidebar-cl] `,
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
      <div className={`flex flex-col items-start`}>
        {userLoading && menuItemSkeletons}

        {!userLoading && (
          <>
            <LinkItem active={location.pathname === "/"} to={"/"}>
              <HomeIcon />
              <span>For You</span>
            </LinkItem>

            {routeList.map((item, i) => (
              <LinkItem
                key={i}
                active={location.pathname.includes(item.path)}
                to={item.path}
              >
                {item.icon}
                <span>{item.title}</span>
              </LinkItem>
            ))}

            {user && (
              <>
                <LinkItem
                  active={location.pathname.includes("/my-music")}
                  to={"/my-music"}
                >
                  <MusicalNoteIcon />
                  <span>My Song</span>
                </LinkItem>

                {user.role === "ADMIN" && (
                  <Link
                    to={"/dashboard"}
                    target="_blank"
                    className={`sidebar-item`}
                  >
                    <ComputerDesktopIcon />
                    <span className="">Dashboard</span>
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

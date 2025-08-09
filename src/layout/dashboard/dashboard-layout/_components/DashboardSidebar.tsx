import {
  ArrowUpRightIcon,
  ComputerDesktopIcon,
  FilmIcon,
  HomeIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@/pages/dashboard/_components";

export const routeList = [
  {
    path: "/dashboard/homepage",
    title: "Home Page",
    icon: <HomeIcon />,
  },
  {
    path: "/dashboard/category",
    title: "Category",
    icon: <SquaresPlusIcon />,
  },
  {
    path: "/dashboard/song",
    title: "Songs",
    icon: <MusicalNoteIcon />,
  },
  {
    path: "/dashboard/playlist",
    title: "Playlists",
    icon: <NewspaperIcon />,
  },
  {
    path: "/dashboard/album",
    title: "Albums",
    icon: <FilmIcon />,
  },
  {
    path: "/dashboard/singer",
    title: "Singers",
    icon: <UserIcon />,
  },
  {
    path: "/dashboard/genre",
    title: "Genres",
    icon: <RectangleGroupIcon />,
  },
];

export default function DashBoardSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useLocation();

  const classes = {
    container: `hidden md:block bg-[#f1f1f1] text-[#333] border-r border-black/10 transition-[width] relative flex-shrink-0`,
    head: "h-[60px] flex items-center justify-center",
    logoText: "text-[22px] font-[500] whitespace-nowrap tracking-[-1px]",
    logoImage: "max-w-[50px] p-[4px]",
    item: `hover:bg-[--a-5-cl] flex whitespace-nowrap space-x-2 items-center justify-center p-2.5 text-sm`,
    icon: "w-[24px] flex-shrink-0",
  };

  return (
    <div
      className={`${classes.container} ${isOpen ? "w-[150px]" : "w-[70px]"}`}
    >
      <div className="h-[60px] flex items-center justify-center">
        <div className="w-10 flex items-center justify-center  bg-white rounded-full">
          <span className="font-bold text-[--primary-cl] leading-[40px] translate-y-[1px]">:D</span>
        </div>
      </div>

      <div className="[&_svg]:w-5 [&_svg]:flex-shrink-0">
        <Link
          className={`
              ${classes.item} ${isOpen ? "!justify-start" : ""}
              ${location.hash === "#/dashboard" ? "text-[--primary-cl]" : ""}`}
          to="/dashboard"
        >
          <ComputerDesktopIcon />
          {isOpen && <span>Dashboard</span>}
        </Link>

        {routeList.map((r, i) => {
          return (
            <Link
              key={i}
              className={`
              ${classes.item} ${isOpen ? "!justify-start" : ""}
              ${location.hash.includes(r.path) ? "text-[--primary-cl]" : ""}`}
              to={r.path}
            >
              {r.icon}
              {isOpen && <span>{r.title}</span>}
            </Link>
          );
        })}

        <Link
          to="/"
          target="_blank"
          className={`${classes.item} ${isOpen ? "!justify-start" : ""}
               ${location.pathname === "/dashboard" ? "text-[--primary-cl]" : ""}
               `}
        >
          <ArrowUpRightIcon className={classes.icon} />
          {isOpen && <span>Home</span>}
        </Link>
      </div>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size={"clear"}
        className={`!absolute p-1.5 bottom-5 right-0 translate-x-[50%]`}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 " />
        ) : (
          <ChevronRightIcon className="w-5" />
        )}
      </Button>
    </div>
  );
}

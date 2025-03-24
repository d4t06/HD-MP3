import {
  ComputerDesktopIcon,
  HomeIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@/pages/dashboard/_components";
import { useThemeContext } from "@/stores";

export const routeList = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <ComputerDesktopIcon className="w-5 flex-shrink-0" />,
  },
  {
    path: "/dashboard/song",
    title: "Songs",
    icon: <MusicalNoteIcon className="w-5 flex-shrink-0" />,
  },
  {
    path: "/dashboard/playlist",
    title: "Playlists",
    icon: <NewspaperIcon className="w-5 flex-shrink-0" />,
  },
  {
    path: "/dashboard/singer",
    title: "Singers",
    icon: <UserIcon className="w-5 flex-shrink-0" />,
  },
  {
    path: "/dashboard/genre",
    title: "Genres",
    icon: <RectangleGroupIcon className="w-5 flex-shrink-0" />,
  },
];

export default function DashBoardSidebar() {
  const { theme } = useThemeContext();

  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const pathName: string = "";

  const classes = {
    container: `hidden md:block bg-[#f1f1f1] text-[#333] border-r border-black/10 transition-[width] relative flex-shrink-0`,
    head: "h-[60px] flex items-center justify-center",
    logoText: "text-[22px] font-[500] whitespace-nowrap tracking-[-1px]",
    logoImage: "max-w-[50px] p-[4px]",
    item: `flex whitespace-nowrap space-x-2 items-center justify-center p-2.5 `,
    itemActive: "text-[#cd1818] bg-[#f1f1f1]",
    icon: "w-[24px] flex-shrink-0",
  };

  return (
    <div className={`${classes.container} ${isOpen ? "w-[150px]" : "w-[70px]"}`}>
      <div className="md:mt-[60px]">
        {routeList.map((r, i) => {
          const active = location.pathname === r.path;

          return (
            <Link
              key={i}
              className={`
              ${active ? theme.content_bg : "hover:bg-black/10"}
              ${classes.item} ${isOpen ? "!justify-start" : ""}
              ${pathName === r.path ? classes.itemActive : ""}`}
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
               ${pathName === "/dashboard" ? classes.itemActive : ""}
               `}
        >
          <HomeIcon className={classes.icon} />
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

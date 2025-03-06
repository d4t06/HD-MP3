import {
  ComputerDesktopIcon,
  HomeIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeContext } from "@/stores";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
    path: "/dashboard",
    title: "Singers",
    icon: <UserIcon className="w-5 flex-shrink-0" />,
  },
  {
    path: "/dashboard",
    title: "Genres",
    icon: <RectangleGroupIcon className="w-5 flex-shrink-0" />,
  },
];

export default function DashBoardSidebar() {
  const { theme } = useThemeContext();

  const [isOpen, setIsOpen] = useState(false);

  const pathName: string = "";

  const classes = {
    container: `hidden md:block ${theme.side_bar_bg} ${theme.text_color} border-r border-${theme.alpha} transition-[width] max-h-[100vh] relative flex-shrink-0`,
    containerExpand: "md:w-[180px]",
    head: "h-[60px] flex items-center justify-center",
    logoText: "text-[22px] font-[500] whitespace-nowrap tracking-[-1px]",
    logoImage: "max-w-[50px] p-[4px]",
    item: `flex whitespace-nowrap space-x-2 items-center justify-center p-2.5 hover:bg-white/10`,
    itemActive: "text-[#cd1818] bg-[#f1f1f1]",
    icon: "w-[24px] flex-shrink-0",
  };

  return (
    <div className={`${classes.container} ${isOpen ? classes.containerExpand : ""}`}>
      <div className="md:mt-[60px]">
        {routeList.map((r, i) => (
          <Link
            key={i}
            className={`${classes.item} ${isOpen ? "!justify-start" : ""}
                  ${pathName === r.path ? classes.itemActive : ""}`}
            to={r.path}
          >
            {r.icon}
            {isOpen && <span>{r.title}</span>}
          </Link>
        ))}

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
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${theme.content_bg} rounded-md p-2 absolute bottom-[20px] right-0 translate-x-[50%] z-[10]`}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 " />
        ) : (
          <ChevronRightIcon className="w-5" />
        )}
      </button>
    </div>
  );
}

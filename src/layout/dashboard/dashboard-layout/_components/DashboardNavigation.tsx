import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRightIcon,
  Bars3Icon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { routeList } from "./DashboardSidebar";
import { Button, Frame } from "@/pages/dashboard/_components";

export default function DashboardNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleWindowClick: EventListener = (e) => {
    if (buttonRef.current?.contains(e.target as Node)) return;
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [isOpen]);

  return (
    <>
      <Frame
        className={`[&_svg]:w-6 [&_span]:font-semibold text-sm absolute z-[99] duration-[.25] flex flex-col
        transition-[left,opacity] bg-[--popup-cl] bottom-[60px] 
        ${
          isOpen
            ? "left-[10px] opacity-[1] pointer-events-auto"
            : "left-0 opacity-[0] pointer-events-none"
        }`}
      >
        <Link
          className={`inline-flex items-center py-1.5 space-x-2`}
          to={"/dashboard"}
        >
          <ComputerDesktopIcon />
          <span>Dashboard</span>
        </Link>

        {routeList.map((r, i) => (
          <Link
            key={i}
            className={`inline-flex items-center py-1.5 space-x-2`}
            to={r.path}
          >
            {r.icon}
            <span>{r.title}</span>
          </Link>
        ))}

        <Link
          className={`inline-flex items-center py-1.5 space-x-2`}
          target="_blank"
          to={"/"}
        >
          <ArrowUpRightIcon />
          <span>Go to app</span>
        </Link>
      </Frame>

      <Button
        ref={buttonRef}
        size={"clear"}
        onClick={() => setIsOpen(!isOpen)}
        className={`!absolute transition-[left] z-[99] bottom-[10px] left-[10px]  p-1.5`}
      >
        <Bars3Icon className="w-6" />
      </Button>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";
import { routeList } from "./DashboardSidebar";
import { Button, Frame } from "@/pages/dashboard/_components";

export default function DashboardNavigation() {
  const { theme } = useThemeContext();

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
        colors={"third"}
        className={`absolute z-[99] duration-[.25] flex flex-col
				transition-[left,opacity] bottom-[80px] 
				${
          isOpen
            ? "left-[10px] opacity-[1] pointer-events-auto"
            : "left-0 opacity-[0] pointer-events-none"
        }`}
      >
        {routeList.map((r, i) => (
          <Link key={i} className={`inline-flex py-1.5 space-x-1`} to={r.path}>
            {r.icon}
            <span>{r.title}</span>
          </Link>
        ))}
      </Frame>

      <Button
        ref={buttonRef}
        size={"clear"}
        onClick={() => setIsOpen(!isOpen)}
        className={`${theme.content_bg} !absolute transition-[left] bottom-[10px]  p-1.5 ${
          isOpen
            ? "left-[10px] "
            : "left-[-10px]"
        }`}
      >
        <Bars3Icon className="w-6" />
      </Button>
    </>
  );
}

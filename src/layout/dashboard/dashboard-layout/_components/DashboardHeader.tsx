import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import NavigationButton from "@/modules/navigation-button";

export default function DashboardHeader() {
  const [scroll, setScroll] = useState(0);

  const handleScroll = (e: Event) => {
    const scrollTop = (e.target as Element).scrollTop || 0;
    setScroll(scrollTop);
  };

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container");

    mainContainer?.addEventListener("scroll", handleScroll);

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`hidden md:flex px-[40px] z-[99] h-[60px] flex-shrink-0 items-center justify-between ${scroll ? " shadow-lg" : ""}`}
      >
        <div className="flex">
          <Link
            to={"/dashboard"}
            className="text-xl font-bold text-[--primary-cl]"
          >
            Dashboard
          </Link>

          <NavigationButton className="ml-5" />
        </div>
      </div>
    </>
  );
}

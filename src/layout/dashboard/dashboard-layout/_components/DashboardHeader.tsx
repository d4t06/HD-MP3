import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import NavigationButton from "@/modules/navigation-button";
import SpotifySearch from "@/pages/dashboard/_modules/spotify-search";

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
        <div className="flex items-center">
          <Link
            to={"/dashboard"}
            className="text-xl font-bold text-[--primary-cl]"
          >
            Dashboard
          </Link>

          <NavigationButton className="ml-5" />
        </div>


        <SpotifySearch />

       {/* <MyPopup appendOnPortal persist>
          <MyPopupTrigger>
            <button>
              <MagnifyingGlassIcon className="w-6" />
            </button>
          </MyPopupTrigger>

          <MyPopupContent>
            <PopupWrapper className="!p-4 ">
              <SpotifySearch />
            </PopupWrapper>
          </MyPopupContent>
        </MyPopup>*/}
      </div>
    </>
  );
}

import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { NavigationProvider, useThemeContext } from "@/stores";
import DashboardNavigation from "./_components/DashboardNavigation";
import ToastPortal from "@/modules/toast-portal";
import GenreProvider from "@/stores/dashboard/GenreContext";
import { Outlet } from "react-router-dom";
import { PushBrowserHistory } from "@/stores/global/NavigationContext";
import SingerProvider from "@/stores/dashboard/SingerContext";
import PlaylistProvider from "@/stores/dashboard/PlaylistContext";
import { useEffect, useRef } from "react";

export default function DashBoardLayout() {
  const { isOnMobile } = useThemeContext();

  const ranEffect = useRef(false);

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      const body = document.querySelector("body");

      if (body) {
        body.setAttribute("data-theme", "white");
        body.classList.remove("dark");
      }

      document.title = "Dashboard";
    }
  }, []);

  return (
    <>
      <NavigationProvider>
        {/*<PageProvider>*/}
        <SingerProvider>
          <PlaylistProvider>
            <GenreProvider>
              <div
                className={`bg-[--layout-cl] text-[--text-cl] fixed inset-full flex `}
              >
                {isOnMobile ? <DashboardNavigation /> : <DashBoardSidebar />}

                <div className="flex flex-col flex-grow">
                  <DashboardHeader />

                  <div className="main-container flex flex-col flex-grow overflow-auto p-[10px] md:px-[40px] md:pt-0">
                    <Outlet />
                  </div>
                </div>

                <ToastPortal className="left-[50%] translate-x-[-50%] top-[10px] md:top-[unset] md:bottom-[60px] md:left-[20px] md:translate-x-0" />
                <PushBrowserHistory />
              </div>
            </GenreProvider>
          </PlaylistProvider>
        </SingerProvider>
        {/*</PageProvider>*/}
      </NavigationProvider>
    </>
  );
}

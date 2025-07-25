import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { NavigationProvider, useThemeContext } from "@/stores";
import DashboardNavigation from "./_components/DashboardNavigation";
import ToastPortal from "@/modules/toast-portal";
import GenreProvider from "@/stores/dashboard/GenreContext";
import { Outlet } from "react-router-dom";
import { PushBrowserHistory } from "@/stores/global/NavigationContext";

export default function DashBoardLayout() {
  const { isOnMobile, theme } = useThemeContext();

  return (
    <>
      <NavigationProvider>
        <GenreProvider>
          <div
            className={`${theme.container} fixed inset-full flex ${theme.text_color}`}
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
      </NavigationProvider>
    </>
  );
}

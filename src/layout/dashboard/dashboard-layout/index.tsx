import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { useThemeContext } from "@/stores";
import DashboardNavigation from "./_components/DashboardNavigation";
import ToastPortal from "@/modules/toast-portal";
import GenreProvider from "@/stores/dashboard/GenreContext";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { dashboardTheme } from "@/constants/themes";

export default function DashBoardLayout() {
  const { setTheme, theme } = useThemeContext();

  useEffect(() => {
    setTheme(dashboardTheme);
  }, []);

  return (
    <>
      <GenreProvider>
        <div className={`${theme.container} fixed inset-full flex ${theme.text_color}`}>
          {/* {isOnMobile ? <DashboardNavigation /> : <DashBoardSidebar />} */}

          <DashboardNavigation />
          <DashBoardSidebar />
          <div className="flex flex-col flex-grow">
            <DashboardHeader />

            <div className="main-container flex flex-col flex-grow overflow-auto p-[10px] md:px-[40px] md:pt-0">
              <Outlet />
            </div>
          </div>
          <ToastPortal className="md:bottom-[40px]" />
        </div>
      </GenreProvider>
    </>
  );
}

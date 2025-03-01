import { ReactNode } from "react";
import { useThemeContext } from "../stores";
import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardUploadSongPortal from "@/layout/_components/DashboardUploadSongPortal";
import ToastPortal from "./_components/ToastPortal";
import DashboardNavigation from "./_components/_components/DashboardNavigation";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme, isOnMobile } = useThemeContext();

  return (
    <>
      <div className={`${theme.container} fixed inset-full flex ${theme.text_color}`}>
        {isOnMobile ? <DashboardNavigation /> : <DashBoardSidebar />}
        <div className="flex flex-col flex-grow">
          {!isOnMobile && <DashboardHeader />}

          <div className="main-container flex flex-col flex-grow overflow-auto p-[10px] md:px-[40px] md:py-[30px]">
            {children}
          </div>
        </div>
        <ToastPortal variant="dashboard" />
        <DashboardUploadSongPortal />
      </div>
    </>
  );
}

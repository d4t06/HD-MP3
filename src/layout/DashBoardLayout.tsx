import { ReactNode } from "react";
import { useTheme } from "../store";
import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardUploadSongPortal from "@/layout/_components/DashboardUploadSongPortal";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <div className={`${theme.container} fixed inset-full flex ${theme.text_color}`}>
        <DashBoardSidebar />
        <div className="flex flex-col flex-grow">
          <DashboardHeader />

          <div className="main-container flex-grow overflow-auto  px-[10px] md:px-[40px] py-[30px]">
            {children}
          </div>
        </div>

        {/*<DashboardPlayer />*/}

        <DashboardUploadSongPortal />
      </div>
    </>
  );
}

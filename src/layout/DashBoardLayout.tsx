import { ReactNode } from "react";
import { DashboardHeader, UploadSongPortal } from "../components";
import { useTheme } from "../store";
// import DashboardPlayer from "@/components/DashboardPlayer";
import DashBoardSidebar from "@/components/DashboardSidebar";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <div className={`${theme.container} fixed inset-full flex ${theme.text_color}`}>
        <DashBoardSidebar />
        <div className="flex flex-col flex-grow">
          <DashboardHeader />

          <div className="main-container flex-grow overflow-auto  px-[10px] md:px-[40px]">
            {children}
          </div>
        </div>

        {/*<DashboardPlayer />*/}

        <UploadSongPortal admin />
      </div>
    </>
  );
}

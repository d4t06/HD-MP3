import { ReactNode } from "react";
import DashBoardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { useThemeContext } from "@/stores";
import DashboardNavigation from "./_components/DashboardNavigation";
import ToastPortal from "@/modules/toast-portal";
import GenreProvider from "@/stores/dashboard/GenreContext";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme, isOnMobile } = useThemeContext();

  return (
    <>
      <GenreProvider>
        <div className={`${theme.container} fixed inset-full flex ${theme.text_color}`}>
          {/* {isOnMobile ? <DashboardNavigation /> : <DashBoardSidebar />} */}

          <DashboardNavigation />
          <DashBoardSidebar />
          <div className="flex flex-col flex-grow">
            {!isOnMobile && <DashboardHeader />}

            <div className="main-container flex flex-col flex-grow overflow-auto p-[10px] md:px-[40px] md:py-[30px]">
              {children}
            </div>
          </div>
          <ToastPortal variant="dashboard" />
        </div>
      </GenreProvider>
    </>
  );
}

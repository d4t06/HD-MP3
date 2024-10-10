import { ReactNode } from "react";
import { DashboardHeader, Player, UploadSongPortal } from "../components";
import { useTheme } from "../store";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`${theme.container} fixed inset-0 flex flex-col ${
          theme.type === "dark" ? "text-white" : "text-[#333]"
        }`}
      >
        <DashboardHeader />
        <div className="flex-grow flex flex-col no-scrollbar overflow-auto">
         <div className="mt-[60px]"></div>
          <div className="container mx-[auto] px-10">{children}</div>
        </div>

        <Player admin />

        <UploadSongPortal admin />
      </div>
    </>
  );
}

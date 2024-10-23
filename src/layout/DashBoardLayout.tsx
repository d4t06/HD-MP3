import { ReactNode } from "react";
import { DashboardHeader, Player, UploadSongPortal } from "../components";
import { useTheme } from "../store";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`${theme.container} fixed inset-0  ${
          theme.type === "dark" ? "text-white" : "text-[#333]"
        }`}
      >
        <DashboardHeader />
        <div className="h-full  pt-[60px] overflow-auto no-scrollbar">
          <div className="container max-w-[800px] h-full">{children}</div>
        </div>

        <Player admin />

        <UploadSongPortal admin />
      </div>
    </>
  );
}

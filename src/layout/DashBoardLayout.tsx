import { ReactNode } from "react";
import { DashboardHeader, UploadSongPortal } from "../components";
import { useTheme } from "../store";
import DashboardPlayer from "@/components/DashboardPlayer";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <div className={`${theme.container} fixed inset-0  ${theme.text_color}`}>
        <DashboardHeader />
        <div className="h-full pt-[60px] overflow-auto no-scrollbar">
          <div className="container max-w-[800px] h-full">{children}</div>
        </div>

        <DashboardPlayer />

        <UploadSongPortal admin />
      </div>
    </>
  );
}

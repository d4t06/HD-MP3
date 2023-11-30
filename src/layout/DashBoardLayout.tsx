import { ReactNode } from "react";
import { DashboardHeader, Player, UploadSongPortal } from "../components";
import { useTheme } from "../store";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
   const { theme } = useTheme();

   return (
      <>
         <div
            className={`${theme.container} min-h-screen ${
               theme.type === "dark" ? "text-white" : "text-[#333]"
            }`}
         >
            <DashboardHeader />
            <div className="h-[calc(100vh-50px)] no-scrollbar overflow-auto">
               <div className={`h-[100px]`}></div>
               <div className="container mx-[auto] px-[40px]">{children}</div>
            </div>

            <Player admin />

            <UploadSongPortal admin />
         </div>
      </>
   );
}

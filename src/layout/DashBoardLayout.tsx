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
            <div className="mt-[50px]">
               <div className={`h-[100px]`}></div>
               <div className="container mx-[auto]">{children}</div>
            </div>

            <Player admin />

            <UploadSongPortal admin />
         </div>
      </>
   );
}

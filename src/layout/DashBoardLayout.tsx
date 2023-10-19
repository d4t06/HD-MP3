import { ReactNode } from "react";
import { DashboardHeader } from "../components";
import { useTheme } from "../store";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
   const { theme } = useTheme();
   const text = `${theme.type === "light" ? "text-[#333]" : "text-white"}`;

   return (
      <>
         <DashboardHeader />
         <div className={`${theme.container} ${text} min-h-screen`}>{children}</div>
      </>
   );
}

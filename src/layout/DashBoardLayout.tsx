import { ReactNode } from "react";
import { Auth, ToastPortal } from "../components";

export default function DashBoardLayout({children}: {children: ReactNode}) {
   return (
      <Auth>
         {children}
        <ToastPortal autoClose />
      </Auth>
   );
}
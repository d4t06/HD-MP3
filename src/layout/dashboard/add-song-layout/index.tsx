import { ReactNode } from "react";
import DashBoardLayout from "../dashboard-layout";
import AddSongProvider from "@/stores/dashboard/AddSongContext";

export default function AddSongLayout({ children }: { children: ReactNode }) {
  return (
    <DashBoardLayout>
      <AddSongProvider>{children}</AddSongProvider>
    </DashBoardLayout>
  );
}

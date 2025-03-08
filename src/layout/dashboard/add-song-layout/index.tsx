import { ReactNode } from "react";
import AddSongProvider from "@/stores/dashboard/AddSongContext";

export default function AddSongLayout({ children }: { children: ReactNode }) {
  return <AddSongProvider>{children}</AddSongProvider>;
}

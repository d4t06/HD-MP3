import { ReactNode } from "react";
import PlaylistProvider from "@/stores/dashboard/PlaylistContext";

export default function PlaylistLayout({ children }: { children: ReactNode }) {
  return <PlaylistProvider>{children}</PlaylistProvider>;
}

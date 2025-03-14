import { ReactNode } from "react";
import SingerProvider from "@/stores/dashboard/SingerContext";

export default function SingerLayout({ children }: { children: ReactNode }) {
  return <SingerProvider>{children}</SingerProvider>;
}

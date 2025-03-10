import { useThemeContext } from "@/stores";
import { ReactNode } from "react";

export default function SongLyricLayout({ children }: { children: ReactNode }) {
  const { theme } = useThemeContext();

  return (
    <div
      className={`${theme.container} ${theme.text_color} fixed left-0 top-0 right-0 bottom-0"`}
    >
      {children}
    </div>
  );
}

import { useTheme } from "@/store";
import { ReactNode } from "react";

export default function SongLyricLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const textColor = () => {
    switch (theme.type) {
      case "light":
        return "text-[#333]";
      case "dark":
        return "text-white";
    }
  };

  return (
    <div
      className={`${theme.container} ${textColor()} fixed left-0 top-0 right-0 bottom-0"`}
    >
      {children}
    </div>
  );
}

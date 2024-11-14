import { useTheme } from "@/store";
import { ElementRef, useEffect, useRef } from "react";

export default function useThemeBgImage() {
  const { theme } = useTheme();

  const containerRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!theme.image) {
      containerRef.current.style.backgroundImage = "";
      return;
    }

    containerRef.current.style.backgroundImage = `url(${theme.image})`;
  }, [theme]);

  return { containerRef };
}

import { useThemeContext } from "@/stores";
import { ElementRef, useEffect, useRef } from "react";

export default function useThemeBgImage() {
  const { theme } = useThemeContext();

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

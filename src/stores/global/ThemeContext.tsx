import { specialThemes, themes } from "@/constants/themes";
import { getLocalStorage } from "@/utils/appHelpers";
import { ReactNode, createContext, useContext, useState } from "react";

let initTheme = themes[0];

const storage = getLocalStorage();
const localStorageThemeId = storage["theme"] as ThemeKeyType | null;

if (location.hash.includes("dashboard")) {
  initTheme = initTheme;
} else if (localStorageThemeId) {
  [...themes, ...specialThemes].forEach((theme) => {
    if (theme.id === localStorageThemeId) {
      initTheme = theme;
    }
  });
}

const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(initTheme);

  return {
    theme,
    setTheme,
    isOnMobile: window.innerWidth < 768, //md breakpoint
  };
};

type ContextType = ReturnType<typeof useTheme>;

const ct = createContext<ContextType | null>(null);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ct.Provider value={useTheme()}>{children}</ct.Provider>;
};

const useThemeContext = () => {
  const ctx = useContext(ct);
  if (!ctx) throw new Error("ThemeProvider not provided");

  return ctx;
};

export default ThemeProvider;

export { useThemeContext };

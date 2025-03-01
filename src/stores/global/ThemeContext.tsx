import { specialThemes, themes } from "@/constants/themes";
import { getLocalStorage } from "@/utils/appHelpers";
import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

let initTheme = themes[3];

const storage = getLocalStorage();
const localStorageThemeId = storage["theme"] as ThemeKeyType | null;

if (localStorageThemeId) {
  [...themes, ...specialThemes].forEach((theme) => {
    if (theme.id === localStorageThemeId) {
      initTheme = theme;
    }
  });
}

const initialState = {
  theme: {
    ...initTheme,
    alpha: initTheme.type === "light" ? "[#000]/5" : "[#fff]/5",
    text_color: initTheme.type === "light" ? "text-[#333]" : "text-[#fff]",
  },
  isOnMobile: window.innerWidth < 800,
  isDev: import.meta.env.DEV,
};

type StateType = typeof initialState;

const enum REDUCER_ACTION_TYPE {
  SETTHEME,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload: {
    theme: ThemeType;
  };
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SETTHEME: {
      const theme = action.payload.theme;
      return {
        ...state,
        theme: {
          ...theme,
          alpha: theme.type === "dark" ? "[#fff]/5" : "[#000]/5",
          text_color: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
        },
      };
    }
  }
};

const useTheme = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTheme = useCallback((theme: ThemeType) => {
    console.log("set theme");

    dispatch({
      type: REDUCER_ACTION_TYPE.SETTHEME,
      payload: { theme },
    });
  }, []);

  return { state, setTheme };
};

type ContextType = ReturnType<typeof useTheme>;

const Context = createContext<ContextType | null>(null);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <Context.Provider value={useTheme()}>{children}</Context.Provider>;
};

const useThemeContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("ThemeProvider not provided");

  const { state, ...rest } = ct;

  return { ...state, rest };
};

export default ThemeProvider;

export { initialState, useThemeContext };

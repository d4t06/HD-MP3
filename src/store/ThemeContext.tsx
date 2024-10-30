import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { themes } from "../constants/themes";
import { getLocalStorage } from "../utils/appHelpers";

type StateType = {
  theme: ThemeType & { alpha: string };
  isOnMobile: boolean;
  isDev: boolean;
};

let initTheme = themes[0];

const storage = getLocalStorage();
const localStorageThemeId = storage["theme"] as ThemeKeyType | null;

if (localStorageThemeId) {
  themes.forEach((theme) => {
    if (theme.id === localStorageThemeId) {
      initTheme = theme;
    }
  });
}

const initialState: StateType = {
  theme: {
    ...initTheme,
    alpha: initTheme.type === "light" ? "[#000]/[.1]" : "[#fff]/[.1]",
    text_color: initTheme.type === "light" ? "text-[#333]" : "text-[#fff]",
  },
  isOnMobile: window.innerWidth < 800,
  isDev: import.meta.env.DEV,
};

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
          alpha: theme.type === "dark" ? "[#fff]/[.1]" : "[#000]/[.1]",
          text_color: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
        },
      };
    }
  }
};

const useThemeReducer = () => {
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

type UseThemeContextType = ReturnType<typeof useThemeReducer>;

const initialContextState: UseThemeContextType = {
  state: initialState,
  setTheme: () => {},
};

const ThemeContext = createContext<UseThemeContextType>(initialContextState);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={useThemeReducer()}>{children}</ThemeContext.Provider>
  );
};

const useTheme = () => {
  const {
    state: { ...restState },
    ...rest
  } = useContext(ThemeContext);

  return { ...restState, ...rest };
};

export default ThemeProvider;

export { ThemeContext, initialState, useTheme };

import { createContext, useCallback, useContext, useReducer } from "react";
import { ThemeKeyType, ThemeType } from "../types";
import { themes } from "../config/themes";

type StateType = { theme: ThemeType & { alpha: string } };

let initTheme = themes[0];
const localStorageThemeId = localStorage.getItem("theme") as ThemeKeyType | null;

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
   },
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

const reducer = (_state: StateType, action: ReducerAction): StateType => {
   // switch (action.type) {
   // }
   const theme = action.payload.theme;
   return {
      theme: {
         ...theme,
         alpha: theme.type === "dark" ? "[#fff]/[.1]" : "[#000]/[.1]",
      },
   };
};

const useThemeContext = (theme: StateType) => {
   const [state, dispatch] = useReducer(reducer, theme);

   const setTheme = useCallback((theme: ThemeType) => {
      console.log("set theme");

      dispatch({
         type: REDUCER_ACTION_TYPE.SETTHEME,
         payload: { theme },
      });
   }, []);

   return { state, setTheme };
};

type UseThemeContextType = ReturnType<typeof useThemeContext>;

const initialContextState: UseThemeContextType = {
   state: initialState,
   setTheme: () => {},
};

const ThemeContext = createContext<UseThemeContextType>(initialContextState);

const ThemeProvider = ({ children, theme }: { children: any; theme: StateType }) => {
   return <ThemeContext.Provider value={useThemeContext(theme)}>{children}</ThemeContext.Provider>;
};

type UseThemeHookType = {
   theme: StateType["theme"];
   setTheme: (theme: ThemeType) => void;
};

const useTheme = (): UseThemeHookType => {
   const {
      state: { theme },
      setTheme,
   } = useContext(ThemeContext);

   return { theme, setTheme };
};

export default ThemeProvider;

export { ThemeContext, initialState, useTheme };

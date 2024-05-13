import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { themes } from "../config/themes";
import { getLocalStorage } from "../utils/appHelpers";

type StateType = { theme: ThemeType & { alpha: string } };

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

import { createContext, useCallback, useContext, useReducer } from "react";
import { ThemeKeyType, ThemeType } from "../types";
import { themes } from "../config/themes";

type StateType = { theme: ThemeType & { alpha: string } };
// type StateType = {
//    id: string,
//    type: string,
//    alpha: string,
//    bottom_player_bg: string,
//    side_bar_bg: string,
//    container_bg: string
//    content_text: string,
// };

const localStorageThemeId: ThemeKeyType = JSON.parse(
   localStorage.getItem("theme")!
);
const initTheme = themes[localStorageThemeId] || themes["red"];

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
      id: ThemeKeyType;
   };
};

const reducer = (_state: StateType, action: ReducerAction): StateType => {
   // switch (action.type) {
   // }
   return {
      theme: {
         ...themes[action.payload.id],
         alpha:
            themes[action.payload.id].type === "dark"
               ? "[#fff]/[.1]"
               : "[#000]/[.1]",
      },
   };
};

const useThemeContext = (theme: StateType) => {
   const [state, dispatch] = useReducer(reducer, theme);

   const setTheme = useCallback((id: ThemeKeyType) => {
      console.log("set theme");
      
      dispatch({
         type: REDUCER_ACTION_TYPE.SETTHEME,
         payload: { id },
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

const ThemeProvider = ({
   children,
   theme,
}: {
   children: any;
   theme: StateType;
}) => {
   return (
      <ThemeContext.Provider value={useThemeContext(theme)}>
         {children}
      </ThemeContext.Provider>
   );
};

type UseThemeHookType = {
   theme: StateType["theme"];
   setTheme: (id: ThemeKeyType) => void;
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

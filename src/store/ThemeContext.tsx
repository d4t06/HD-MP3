import { createContext, useCallback, useContext, useReducer } from 'react'

type StateType = {
   theme: string;
}

const initialState: StateType = {
   theme: 'indigo'
}

const enum REDUCER_ACTION_TYPE {
   SETTHEME,
}

type ReducerAction = {
   type: REDUCER_ACTION_TYPE,
   payload: string,

}

const reducer = (_state: StateType,
   action: ReducerAction): StateType => {

   switch (action.type) {
      case REDUCER_ACTION_TYPE.SETTHEME:

         switch (action.payload) {
            case "light":
               return { theme: "light" }

            case "dark":
               return { theme: "dark" }

            default:
               throw new Error()
         }

      default:
         throw new Error()
   }
}

const useThemeContext = (initialState: StateType) => {
   const [state, dispatch] = useReducer(reducer, initialState);


   const setTheme = useCallback((theme: string) => {
      dispatch({ type: REDUCER_ACTION_TYPE.SETTHEME, payload: theme })
   }, [])

   return { state, setTheme }
}

type UseThemeContextType = ReturnType<typeof useThemeContext>

const initialContextState: UseThemeContextType = {
   state: initialState,
   setTheme: () => { }
}

const ThemeContext = createContext<UseThemeContextType>(initialContextState)

const ThemeProvider = ({ children, ...initialState }: { children: any } & StateType) => {

   return <ThemeContext.Provider value={useThemeContext(initialState)}>
      {children}
   </ThemeContext.Provider>
}

type UseThemeHookType = {
   theme: string,
   setTheme: (theme: string) => void
}

const useTheme = (): UseThemeHookType => {
   const { state: { theme }, setTheme } = useContext(ThemeContext)

   return { theme, setTheme }
}

export default ThemeProvider

export { ThemeContext, initialState, useTheme };
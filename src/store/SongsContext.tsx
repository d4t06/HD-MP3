import { createContext, useCallback, useContext, useReducer } from "react";
import { Song } from "../types";

type StateType = { songs: Song[] };

const initialSongs: StateType = {
   songs: []
};

const enum REDUCER_ACTION_TYPE {
   SETSONGS,
}

type ReducerAction = {
   type: REDUCER_ACTION_TYPE;
   payload: {
      songs?: Song[];
   };
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SETSONGS:
         return {
            songs: action.payload.songs || [],
         };
      default:
         return {
            songs: state.songs,
         };
   }
};

const useSongsContext = (songsStore: StateType) => {
   const [state, dispatch] = useReducer(reducer, songsStore);

   const setSongs = useCallback((songs: Song[]) => {
      // console.log("set songs payload");
      dispatch({
         type: REDUCER_ACTION_TYPE.SETSONGS,
         payload: { songs },
      });
   }, []);

   return { state, setSongs };
};

type UseSongsContextType = ReturnType<typeof useSongsContext>;

const initialContextState: UseSongsContextType = {
   state: initialSongs,
   setSongs: () => {},
};

const SongsContext = createContext<UseSongsContextType>(initialContextState);

const SongsProvider = ({
   children,
   songsStore,
}: {
   children: any;
   songsStore: StateType;
}) => {
   return (
      <SongsContext.Provider value={useSongsContext(songsStore)}>
         {children}
      </SongsContext.Provider>
   );
};

type UseThemeHookType = {
   songs: StateType["songs"];
   setSongs: (songs: Song[]) => void;
};

const useSongs = (): UseThemeHookType => {
   const {
      state: { songs },
      setSongs,
   } = useContext(SongsContext);

   return { songs, setSongs };
};

export default SongsProvider;

export { SongsContext, initialSongs, useSongs };

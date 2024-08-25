import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

type StateType = {
   isChecked: boolean;
   selectedSongs: Song[];
   isSelectAll: boolean;
};

const initialState: StateType = {
   isChecked: false,
   isSelectAll: false,
   selectedSongs: [],
};

const enum REDUCER_ACTION_TYPE {
   SELECT_SONG,
   REMOVE_SONG,
   RESET,
   SET_CHECkED,
   SELECT_ALL,
}

type Reset = {
   type: REDUCER_ACTION_TYPE.RESET;
};

type SetChecked = {
   type: REDUCER_ACTION_TYPE.SET_CHECkED;
};

type SelectSong = {
   type: REDUCER_ACTION_TYPE.SELECT_SONG;
   payload: {
      song: Song;
   };
};

type SetAllSong = {
   type: REDUCER_ACTION_TYPE.SELECT_ALL;
   payload: {
      songs: Song[];
   };
};

type PayloadAction = Reset | SetAllSong | SelectSong | SetChecked;

const reducer = (state: StateType, action: PayloadAction): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SELECT_SONG: {
         const { song } = action.payload;

         const newSongs = [...state.selectedSongs];
         const index = newSongs.findIndex((s) => s.id === song.id);

         if (index === -1) newSongs.push(song);
         else newSongs.splice(index, 1);

         return {
            ...state,
            selectedSongs: newSongs,
            isChecked: !!newSongs.length,
         };
      }

      case REDUCER_ACTION_TYPE.RESET:
         return initialState;
      case REDUCER_ACTION_TYPE.SET_CHECkED:
         return state;
      case REDUCER_ACTION_TYPE.SELECT_ALL: {
         const { songs } = action.payload;

         return {
            ...state,
            selectedSongs: songs,
            isChecked: true,
            isSelectAll: true,
         };
      }
   }

   return state;
};

const useSelectSongReducer = () => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const setChecked = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SET_CHECkED,
      });
   }, []);
   const resetSelect = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.RESET,
      });
   }, []);

   const selectSong = useCallback((song: Song) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SELECT_SONG,
         payload: { song },
      });
   }, []);

   const selectAll = useCallback((songs: Song[]) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SELECT_ALL,
         payload: { songs },
      });
   }, []);

   return { state, setChecked, selectSong, selectAll, resetSelect };
};

type ContextType = ReturnType<typeof useSelectSongReducer>;

const initialContext: ContextType = {
   state: {
      isChecked: false,
      isSelectAll: false,
      selectedSongs: [],
   },
   resetSelect: () => {},
   selectAll: () => {},
   selectSong: () => {},
   setChecked: () => {},
};

const SongSelectContext = createContext<ContextType>(initialContext);

export const useSongSelectContext = () => {
   const context = useContext(SongSelectContext);

   const {
      state: { ...restState },
      ...rest
   } = context;

   return { ...restState, ...rest };
};

export default function SongSelectProvider({ children }: { children: ReactNode }) {
   return (
      <SongSelectContext.Provider value={useSelectSongReducer()}>
         {children}
      </SongSelectContext.Provider>
   );
}

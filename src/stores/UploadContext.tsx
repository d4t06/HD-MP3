import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
type StateType = {
   tempSongs: SongSchema[];
   status: "" | "uploading" | "finish" | "finish-error";
};

const initialState: StateType = {
   tempSongs: [],
   status: "",
};

const enum REDUCER_ACTION_TYPE {
   SETTEMPSONG,
   SHIFTSONG,
   CLEARTEMPSONG,
}

type SetTempSong = {
   type: REDUCER_ACTION_TYPE.SETTEMPSONG;
   payload: { songs: SongSchema[] };
};

type SpliceTempSong = {
   type: REDUCER_ACTION_TYPE.SHIFTSONG;
};

type ClearTempSong = {
   type: REDUCER_ACTION_TYPE.CLEARTEMPSONG;
   payload: { status: StateType["status"] };
};

type ReducerAction = SetTempSong | SpliceTempSong | ClearTempSong;

const reducer = (state: StateType, action: ReducerAction): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SETTEMPSONG: {
         const { songs } = action.payload;

         return { ...state, tempSongs: songs, status: "uploading" };
      }

      case REDUCER_ACTION_TYPE.SHIFTSONG: {
         const newSongs = [...state.tempSongs];
         newSongs.shift();

         return { ...state, tempSongs: newSongs };
      }

      case REDUCER_ACTION_TYPE.CLEARTEMPSONG: {
         const { status } = action.payload;
         return { ...state, tempSongs: [], status };
      }
   }
};

const useUploadActions = () => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const setTempSongs = useCallback((songs: SongSchema[]) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SETTEMPSONG,
         payload: { songs },
      });
   }, []);

   const shiftSong = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SHIFTSONG,
      });
   }, []);

   const clearTempSongs = useCallback((status: StateType["status"]) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.CLEARTEMPSONG,
         payload: { status },
      });
   }, []);

   return {
      state,
      setTempSongs,
      shiftSong,
      clearTempSongs,
   };
};

type ContextType = ReturnType<typeof useUploadActions>;

const initialContext: ContextType = {
   state: initialState,
   setTempSongs: () => {},
   shiftSong: () => {},
   clearTempSongs: () => {},
};

const UploadSongContext = createContext<ContextType>(initialContext);

const UploadSongProvider = ({ children }: { children: ReactNode }) => {
   return (
      <UploadSongContext.Provider value={useUploadActions()}>
         {children}
      </UploadSongContext.Provider>
   );
};

const useUpload = () => {
   const {
      state: { ...restState },
      ...restSetState
   } = useContext(UploadSongContext);
   return { ...restSetState, ...restState };
};

export default UploadSongProvider;
export { useUpload };

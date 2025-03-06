import { ReactNode, createContext, useContext, useState } from "react";
// type StateType = {
//    tempSongs: SongSchema[];
//    status: "" | "uploading";
// };

// const initialState: StateType = {
//    tempSongs: [],
//    status: "",
// };

// const enum REDUCER_ACTION_TYPE {
//    SETTEMPSONG,
//    SHIFTSONG,
//    CLEARTEMPSONG,
// }

// type SetTempSong = {
//    type: REDUCER_ACTION_TYPE.SETTEMPSONG;
//    payload: { songs: SongSchema[] };
// };

// type SpliceTempSong = {
//    type: REDUCER_ACTION_TYPE.SHIFTSONG;
// };

// type ClearTempSong = {
//    type: REDUCER_ACTION_TYPE.CLEARTEMPSONG;
//    payload: { status: StateType["status"] };
// };

// type ReducerAction = SetTempSong | SpliceTempSong | ClearTempSong;

// const reducer = (state: StateType, action: ReducerAction): StateType => {
//    switch (action.type) {
//       case REDUCER_ACTION_TYPE.SETTEMPSONG: {
//          const { songs } = action.payload;

//          return { ...state, tempSongs: songs, status: "uploading" };
//       }

//       case REDUCER_ACTION_TYPE.SHIFTSONG: {
//          const newSongs = [...state.tempSongs];
//          newSongs.shift();

//          return { ...state, tempSongs: newSongs };
//       }

//       case REDUCER_ACTION_TYPE.CLEARTEMPSONG: {
//          const { status } = action.payload;
//          return { ...state, tempSongs: [], status };
//       }
//    }
// };

// const useUploadActions = () => {
//    const [state, dispatch] = useReducer(reducer, initialState);

//    const setTempSongs = useCallback((songs: SongSchema[]) => {
//       dispatch({
//          type: REDUCER_ACTION_TYPE.SETTEMPSONG,
//          payload: { songs },
//       });
//    }, []);

//    const shiftSong = useCallback(() => {
//       dispatch({
//          type: REDUCER_ACTION_TYPE.SHIFTSONG,
//       });
//    }, []);

//    const clearTempSongs = useCallback((status: StateType["status"]) => {
//       dispatch({
//          type: REDUCER_ACTION_TYPE.CLEARTEMPSONG,
//          payload: { status },
//       });
//    }, []);

//    return {
//       state,
//       setTempSongs,
//       shiftSong,
//       clearTempSongs,
//    };
// };

// type ContextType = ReturnType<typeof useUploadActions>;

// const initialContext: ContextType = {
//    state: initialState,
//    setTempSongs: () => {},
//    shiftSong: () => {},
//    clearTempSongs: () => {},
// };

function useUpload() {
  const [uploadingSongs, setUploadingSongs] = useState<SongSchema[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const resetUploadContext = () => {
    setIsUploading(false);
    setUploadingSongs([]);
  };

  return {
    uploadingSongs,
    setUploadingSongs,
    isUploading,
    setIsUploading,
    resetUploadContext,
  };
}

type ContextType = ReturnType<typeof useUpload>;

const Context = createContext<ContextType | null>(null);

const UploadSongProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Context.Provider value={useUpload()}>
      {children}
    </Context.Provider>
  );
};

const useUploadContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("UploadSongProvider not provided");
  return ct;
};

export default UploadSongProvider;
export { useUploadContext };

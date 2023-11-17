// init state

import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";
import { Song } from "../types";

type StateType = {
   tempSongs: Song[];
   addedSongIds: string[];
   status: "uploading" | "finish" | "idle" | "finish-error";
};

const initialState: StateType = {
   tempSongs: [],
   addedSongIds: [],
   status: "idle",
};

// create context
// we expect {
//    state: {...props},
//    setState
//    ...
// }
type ContextType = {
   state: StateType;
   setTempSongs: Dispatch<SetStateAction<Song[]>>;
   setAddedSongIds: Dispatch<SetStateAction<string[]>>;
   setStatus: Dispatch<SetStateAction<StateType["status"]>>;
};

const initialContext: ContextType = {
   state: initialState,
   setTempSongs: () => {},
   setAddedSongIds: () => {},
   setStatus: () => {},
};

const UploadSongContext = createContext(initialContext);

// define context provider
const UploadSongProvider = ({ children }: { children: ReactNode }) => {
   const [tempSongs, setTempSongs] = useState<Song[]>([]);
   const [addedSongIds, setAddedSongIds] = useState<string[]>([]);

   const [status, setStatus] = useState<StateType["status"]>("idle");

   return (
      <UploadSongContext.Provider
         value={{
            state: { addedSongIds, tempSongs, status },
            setAddedSongIds,
            setTempSongs,
            setStatus,
         }}
      >
         {children}
      </UploadSongContext.Provider>
   );
};

// define useToast Hook
const useUpload = () => {
   const {
      state: { addedSongIds, tempSongs, status },
      setTempSongs,
      setAddedSongIds,
      setStatus
   } = useContext(UploadSongContext);
   return { addedSongIds, tempSongs, setTempSongs, setAddedSongIds, setStatus, status };
};

export default UploadSongProvider;
export { useUpload };

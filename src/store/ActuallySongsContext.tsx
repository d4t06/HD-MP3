import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { Song } from "../types";
import { useSongsStore } from "./SongsContext";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "./SongSlice";

// define initial state
type StateType = {
   actuallySongs: Song[];
};

const initialState: StateType = {
   actuallySongs: [],
};

// define initial contextState
type ContextType = {
   state: StateType;
   setActuallySongs: Dispatch<SetStateAction<Song[]>>;
};

const initialContext: ContextType = {
   state: initialState,
   setActuallySongs: () => {},
};

// create context
const ActuallySongsContext = createContext(initialContext);

// define provider
const ActuallySongsProvider = ({ children }: { children: ReactNode }) => {
   const { adminSongs, userSongs, initial } = useSongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);

   const [actuallySongs, setActuallySongs] = useState<Song[]>([]);
   const [songsList, setSongsList] = useState<Song[]>([]);

   // play in songs then play in playlist
   // play in playlist then add song to playlis
   // play in songs then user add new song
   useEffect(() => {
      if (!initial) return;

      if (!songInStore.name) return;

      if (songInStore.song_in.includes("playlist")) {
         console.log("set actually songs");
         setSongsList(actuallySongs);
         return;
      }

      if (songInStore.song_in === "admin") {
         setSongsList(adminSongs);
      } else {
         setSongsList(userSongs);
      }
      console.log("set actually songs");
   }, [songInStore.song_in, initial, actuallySongs, userSongs]);

   return (
      <ActuallySongsContext.Provider
         value={{ state: { actuallySongs: songsList }, setActuallySongs }}
      >
         {children}
      </ActuallySongsContext.Provider>
   );
};

const useActuallySongs = () => {
   const {
      setActuallySongs,
      state: { actuallySongs },
   } = useContext(ActuallySongsContext);

   return { actuallySongs, setActuallySongs };
};

export default ActuallySongsProvider;
export { useActuallySongs };

import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from ".";
import { getLocalStorage, setLocalStorage } from "../utils/appHelpers";

// define initial state
type StateType = {
   actuallySongs: Song[];
};

let initActuallySongs: Song[] = [];
// const hd_mp3 = JSON.parse(
//    localStorage.getItem("hdmp3") || JSON.stringify({ songs: [], current: "" })
// ) as { songs: Song[]; current: string } | "";

const storage = getLocalStorage()
if (storage && storage?.songs) {
   initActuallySongs = storage.songs;
}

const initialState: StateType = {
   actuallySongs: initActuallySongs,
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
   const [actuallySongs, setActuallySongs] = useState<Song[]>(initActuallySongs);
   const { song: songInStore } = useSelector(selectAllSongStore);

   useEffect(() => {
      setLocalStorage("songs", actuallySongs);
      setLocalStorage("current", songInStore.id);
   }, [actuallySongs, songInStore.currentIndex]);

   return (
      <ActuallySongsContext.Provider
         value={{ state: { actuallySongs: actuallySongs }, setActuallySongs }}
      >
         {children}
      </ActuallySongsContext.Provider>
   );
};

const useActuallySongsStore = () => {
   const {
      setActuallySongs,
      state: { actuallySongs },
   } = useContext(ActuallySongsContext);

   const removeFromQueue = (song: Song) => {
      const newQueue = actuallySongs.filter((s) => s.id !== song.id);
      setActuallySongs(newQueue);
      console.log("setActuallySongs");
   };

   const addToQueue = (song: Song) => {
      const newQueue = [...actuallySongs];
      newQueue.push(song);
      setActuallySongs(newQueue);

      console.log("setActuallySongs");
   };

   return { actuallySongs, setActuallySongs, addToQueue, removeFromQueue };
};

export default ActuallySongsProvider;
export { useActuallySongsStore };

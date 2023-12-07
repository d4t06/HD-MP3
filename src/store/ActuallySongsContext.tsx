import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Song } from "../types";
import { useSelector } from "react-redux";
import { selectAllSongStore } from ".";

// define initial state
type StateType = {
   actuallySongs: Song[];
};

let initActuallySongs: Song[] = [];
const hd_mp3 = JSON.parse(localStorage.getItem("hdmp3") || JSON.stringify({ songs: [], current: "" })) as
   | { songs: Song[]; current: string }
   | "";
if (hd_mp3) {
   initActuallySongs = hd_mp3.songs;
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
      localStorage.setItem("hdmp3", JSON.stringify({ songs: actuallySongs, current: songInStore.id }));
   }, [actuallySongs, songInStore.currentIndex]);

   return (
      <ActuallySongsContext.Provider value={{ state: { actuallySongs: actuallySongs }, setActuallySongs }}>
         {children}
      </ActuallySongsContext.Provider>
   );
};

const useActuallySongs = () => {
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
export { useActuallySongs };

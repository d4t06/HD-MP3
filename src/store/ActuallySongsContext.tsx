import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from "react";
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
const ActuallySongsProvider = ({ children }: {children: ReactNode}) => {
   const [actuallySongs, setActuallySongs] = useState<Song[]>([]);

   return (
      <ActuallySongsContext.Provider value={{ state: { actuallySongs }, setActuallySongs }}>
         {children}
      </ActuallySongsContext.Provider>
   );
};

const useActuallySongs = () => {
   const {
      setActuallySongs,
      state: { actuallySongs },
   } = useContext(ActuallySongsContext);

   const {adminSongs, userSongs} = useSongsStore();
   const {song: songInStore} = useSelector(selectAllSongStore);

   // user uploads songs
   // user play song in many playist
   // user play admin
   const songLists = useMemo(() => {
      return songInStore.song_in.includes("playlist")
         ? actuallySongs
         : songInStore.song_in === "admin"
            ? adminSongs
            : userSongs;
   }, [songInStore.song_in, actuallySongs, userSongs]);
   
   return { songLists, setActuallySongs };
};

export default ActuallySongsProvider
export {useActuallySongs}
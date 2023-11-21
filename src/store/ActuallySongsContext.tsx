import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Song } from "../types";

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
  const [actuallySongs, setActuallySongs] = useState<Song[]>([]);

  return (
    <ActuallySongsContext.Provider
      value={{ state: { actuallySongs: actuallySongs }, setActuallySongs }}
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

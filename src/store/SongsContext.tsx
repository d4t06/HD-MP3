import { createContext, useCallback, useContext, useReducer } from "react";
import { Playlist, Song } from "../types";

type StateType = { songs: Song[]; playlists: Playlist[] };

const initialSongs: StateType = {
  songs: [],
  playlists: [],
};

const enum REDUCER_ACTION_TYPE {
  SETSONGS,
  SETPLAYLISTS,
  INIT,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload: {
    songs?: Song[];
    playlists?: Playlist[];
  };
};

// reducer
const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.INIT:
      return {
        songs: action.payload.songs || [],
        playlists: action.payload.playlists || [],
      };
    case REDUCER_ACTION_TYPE.SETSONGS:
      return {
        songs: action.payload.songs || [],
        playlists: state.playlists,
      };
    case REDUCER_ACTION_TYPE.SETPLAYLISTS:
      return {
        songs: state.songs,
        playlists: action.payload.playlists || [],
      };
    default:
      return {
        songs: state.songs,
        playlists: state.playlists,
      };
  }
};

// actions
const useSongsContext = (songsStore: StateType) => {
  const [state, dispatch] = useReducer(reducer, songsStore);

  const setSongs = useCallback((songs: Song[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SETSONGS,
      payload: { songs },
    });
  }, []);

  const init = useCallback((songs: Song[], playlists : Playlist[]) => {
   // console.log("set songs payload");
   dispatch({
     type: REDUCER_ACTION_TYPE.INIT,
     payload: { songs, playlists },
   });
 }, []);

 const setPlaylists = useCallback((playlists : Playlist[]) => {
   // console.log("set songs payload");
   dispatch({
     type: REDUCER_ACTION_TYPE.SETPLAYLISTS,
     payload: { playlists },
   });
 }, []);

  return { state, setSongs, init, setPlaylists };
};

type UseSongsContextType = ReturnType<typeof useSongsContext>;

const initialContextState: UseSongsContextType = {
  state: initialSongs,
  setSongs: () => {},
  init: () => {},
  setPlaylists: () => {},
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
  playlists: StateType["playlists"];
  setSongs: (songs: Song[]) => void;
  init: (songs: Song[] | [], playlists: Playlist[] | []) => void;
  setPlaylists: (playlist: Playlist[]) => void;
};

const useSongs = (): UseThemeHookType => {
  const {
    state: { songs, playlists },
    setSongs,
    init,
    setPlaylists
  } = useContext(SongsContext);

  return { songs, playlists, setSongs, init, setPlaylists };
};

export default SongsProvider;

export { SongsContext, initialSongs, useSongs };

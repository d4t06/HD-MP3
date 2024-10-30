import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

type StateType = {
  userSongs: Song[];
  adminSongs: Song[];
  userPlaylists: Playlist[];
  adminPlaylists: Playlist[];
  initial: boolean;
};

const initialState: StateType = {
  userSongs: [],
  userPlaylists: [],
  adminSongs: [],
  adminPlaylists: [],
  initial: false,
};

const enum REDUCER_ACTION_TYPE {
  SETUSERSONGS,
  SETADMINSONGS,
  ADDUSERSONG,
  UPDATEUSERSONG,
  ADDUSERPLAYLIST,
  UPDATEUSERPLAYLIST,
  SETUSERPLAYLISTS,
  SETADMINPLAYLISTS,
  INIT,
  RESET,
}

type Init = {
  type: REDUCER_ACTION_TYPE.INIT;
  payload: Partial<StateType>;
};

type AddUserSong = {
  type: REDUCER_ACTION_TYPE.ADDUSERSONG;
  payload: {
    songs: Song[];
  };
};

type SetUserSong = {
  type: REDUCER_ACTION_TYPE.SETUSERSONGS;
  payload: {
    songs: Song[];
  };
};

type UpdateUserSong = {
  type: REDUCER_ACTION_TYPE.UPDATEUSERSONG;
  payload: {
    song: Song;
  };
};

type AddUserPlaylist = {
  type: REDUCER_ACTION_TYPE.ADDUSERPLAYLIST;
  payload: {
    playlist: Playlist;
  };
};

type SetUserPlaylist = {
  type: REDUCER_ACTION_TYPE.SETUSERPLAYLISTS;
  payload: {
    playlists: Playlist[];
  };
};

type UpdateUserPlaylist = {
  type: REDUCER_ACTION_TYPE.UPDATEUSERPLAYLIST;
  payload: {
    playlist: Partial<Playlist>;
    id: string;
  };
};

type Reset = {
  type: REDUCER_ACTION_TYPE.RESET;
};

type ReducerAction =
  | Init
  | SetUserSong
  | AddUserSong
  | UpdateUserSong
  | AddUserPlaylist
  | UpdateUserPlaylist
  | SetUserPlaylist
  | Reset;

// reducer
const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.INIT: {
      const payload = action.payload;
      return { ...state, ...payload, initial: true };
    }
    case REDUCER_ACTION_TYPE.ADDUSERSONG: {
      const { songs } = action.payload;
      const newSongs = [...state.userSongs, ...songs];

      return {
        ...state,
        userSongs: newSongs,
      };
    }
    case REDUCER_ACTION_TYPE.UPDATEUSERSONG: {
      const { song } = action.payload;

      const newSongs = [...state.userSongs];
      const index = newSongs.findIndex((s) => s.id === song.id);

      if (index === -1) return state;
      newSongs[index] = song;

      return { ...state, userSongs: newSongs };
    }
    case REDUCER_ACTION_TYPE.ADDUSERPLAYLIST: {
      const { playlist } = action.payload;
      return {
        ...state,
        userPlaylists: [...state.userPlaylists, playlist],
      };
    }
    case REDUCER_ACTION_TYPE.UPDATEUSERPLAYLIST: {
      const { playlist, id } = action.payload;

      const newPlaylists = [...state.userPlaylists];
      const index = state.userPlaylists.findIndex((p) => p.id === id);

      if (index === -1) return state;
      newPlaylists[index] = { ...newPlaylists[index], ...playlist };

      return { ...state, userPlaylists: newPlaylists };
    }
    case REDUCER_ACTION_TYPE.RESET:
      return initialState;

    case REDUCER_ACTION_TYPE.SETUSERSONGS: {
      const { songs } = action.payload;
      return {
        ...state,
        userSongs: songs,
      };
    }

    case REDUCER_ACTION_TYPE.SETUSERPLAYLISTS: {
      const { playlists } = action.payload;
      return {
        ...state,
        userPlaylists: playlists,
      };
    }

    default:
      return state;
  }
};

// actions
const useSongsActions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUserSongs = useCallback((songs: Song[]) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.SETUSERSONGS,
      payload: { songs },
    });
  }, []);

  const addUserSongs = useCallback((songs: Song[]) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.ADDUSERSONG,
      payload: { songs },
    });
  }, []);

  const updateUserSong = useCallback((song: Song) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.UPDATEUSERSONG,
      payload: { song },
    });
  }, []);

  const addUserPlaylist = useCallback((playlist: Playlist) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.ADDUSERPLAYLIST,
      payload: { playlist },
    });
  }, []);

  const setUserPlaylists = useCallback((playlists: Playlist[]) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.SETUSERPLAYLISTS,
      payload: { playlists },
    });
  }, []);

  const updateUserPlaylist = useCallback(
    ({ id, playlist }: { playlist: Partial<Playlist>; id: string }) => {
      return dispatch({
        type: REDUCER_ACTION_TYPE.UPDATEUSERPLAYLIST,
        payload: { playlist, id },
      });
    },
    []
  );

  const resetSongPlaylistStore = useCallback(() => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.RESET,
    });
  }, []);

  const initSongsContext = useCallback((payload: Partial<StateType>) => {
    return dispatch({
      type: REDUCER_ACTION_TYPE.INIT,
      payload,
    });
  }, []);

  return {
    state,
    resetSongPlaylistStore,
    setUserSongs,
    addUserSongs,
    addUserPlaylist,
    updateUserSong,
    updateUserPlaylist,
    initSongsContext,
    setUserPlaylists,
  };
};

type UseSongsContextType = ReturnType<typeof useSongsActions>;

const initialContext: UseSongsContextType = {
  state: initialState,
  initSongsContext: () => {},
  addUserPlaylist: () => {},
  addUserSongs: () => {},
  resetSongPlaylistStore: () => {},
  setUserSongs: () => {},
  updateUserPlaylist: () => {},
  updateUserSong: () => {},
  setUserPlaylists: () => {},
};

const SongsContext = createContext<UseSongsContextType>(initialContext);

const SongsProvider = ({
  children,
}: // songsStore,
{
  children: ReactNode;
  // songsStore: StateType;
}) => {
  return (
    <SongsContext.Provider value={useSongsActions()}>{children}</SongsContext.Provider>
  );
};

const useSongsStore = () => {
  const {
    state: { ...restState },
    ...restAction
  } = useContext(SongsContext);

  return {
    ...restState,
    ...restAction,
  };
};

export default SongsProvider;

export { SongsContext, useSongsStore };

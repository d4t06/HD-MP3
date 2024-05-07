import { createContext, useCallback, useContext, useReducer } from "react";
// only change user song, user playlist

type StateType = {
   userSongs: Song[];
   adminSongs: Song[];

   userPlaylists: Playlist[];
   adminPlaylists: Playlist[];

   // user. User;

   initial: boolean;
};

const initialSongs: StateType = {
   userSongs: [],
   userPlaylists: [],

   adminSongs: [],
   adminPlaylists: [],

   initial: false,
};

const enum REDUCER_ACTION_TYPE {
   SETUSERSONGS,
   SETADMINSONGS,
   SETUSERPLAYLISTS,
   SETADMINPLAYLISTS,
   INIT,
}

type ReducerAction = {
   type: REDUCER_ACTION_TYPE;
   payload: {
      userSongs?: Song[];
      userPlaylists?: Playlist[];

      adminSongs?: Song[];
      adminPlaylists?: Playlist[];

      user?: User;
   };
};

// reducer
const reducer = (state: StateType, action: ReducerAction): StateType => {
   const payload = action.payload;

   switch (action.type) {
      case REDUCER_ACTION_TYPE.INIT:
         return {
            userSongs: payload.userSongs || [],
            userPlaylists: payload.userPlaylists || [],

            adminSongs: payload.adminSongs || state.adminSongs,
            adminPlaylists: payload.adminPlaylists || state.adminPlaylists,

            initial:
               payload.adminSongs?.length || payload.userSongs?.length ? true : false,
         };

      case REDUCER_ACTION_TYPE.SETUSERSONGS:
         return {
            initial: state.initial,
            adminSongs: state.adminSongs,
            userPlaylists: state.userPlaylists,
            adminPlaylists: state.adminPlaylists,

            userSongs: payload.userSongs || [],
         };

      case REDUCER_ACTION_TYPE.SETUSERPLAYLISTS:
         return {
            initial: state.initial,
            userSongs: state.userSongs,
            adminSongs: state.adminSongs,
            adminPlaylists: state.adminPlaylists,

            userPlaylists: payload.userPlaylists || [],
         };

      case REDUCER_ACTION_TYPE.SETADMINSONGS:
         return {
            userSongs: [],
            userPlaylists: [],
            initial: state.initial,
            adminPlaylists: state.adminPlaylists,

            adminSongs: payload.adminSongs || [],
         };

      case REDUCER_ACTION_TYPE.SETADMINPLAYLISTS:
         return {
            userSongs: [],
            userPlaylists: [],
            initial: state.initial,
            adminSongs: state.adminSongs,

            adminPlaylists: payload.adminPlaylists || [],
         };
      default:
         return {
            initial: state.initial,
            userSongs: state.userSongs,
            adminSongs: state.adminSongs,

            userPlaylists: state.userPlaylists,
            adminPlaylists: state.adminPlaylists,
         };
   }
};

// actions
const useSongsContext = (songsStore: StateType) => {
   const [state, dispatch] = useReducer(reducer, songsStore);

   const setUserSongs = useCallback((userSongs: Song[]) => {
      console.log("set user songs");
      return dispatch({
         type: REDUCER_ACTION_TYPE.SETUSERSONGS,
         payload: { userSongs },
      });
   }, []);

   const setAdminSongs = useCallback((adminSongs: Song[]) => {
      console.log("set user songs");
      return dispatch({
         type: REDUCER_ACTION_TYPE.SETADMINSONGS,
         payload: { adminSongs },
      });
   }, []);

   const initSongsContext = useCallback(
      ({
         userSongs,
         adminSongs,
         userPlaylists,
         adminPlaylists,
      }: // user.
      {
         // user. User | undefined;
         userSongs?: Song[];
         adminSongs?: Song[];
         userPlaylists?: Playlist[];
         adminPlaylists?: Playlist[];
      }) => {
         console.log("init song context");

         return dispatch({
            type: REDUCER_ACTION_TYPE.INIT,
            payload: { userSongs, adminSongs, userPlaylists, adminPlaylists },
         });
      },
      []
   );

   const setUserPlaylists = useCallback((userPlaylists: Playlist[]) => {
      console.log("set user playlist");
      return dispatch({
         type: REDUCER_ACTION_TYPE.SETUSERPLAYLISTS,
         payload: { userPlaylists },
      });
   }, []);

   const setAdminPlaylists = useCallback((adminPlaylists: Playlist[]) => {
      console.log("set admin playlist");
      return dispatch({
         type: REDUCER_ACTION_TYPE.SETADMINPLAYLISTS,
         payload: { adminPlaylists },
      });
   }, []);

   return {
      state,
      setUserSongs,
      initSongsContext,
      setUserPlaylists,
      setAdminSongs,
      setAdminPlaylists,
   };
};

type UseSongsContextType = ReturnType<typeof useSongsContext>;

const initialContextState: UseSongsContextType = {
   state: initialSongs,
   setUserSongs: () => {},
   setAdminSongs: () => {},
   initSongsContext: () => {},
   setUserPlaylists: () => {},
   setAdminPlaylists: () => {},
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

export type UseSongsHookType = {
   // user. StateType["user.];
   initial: StateType["initial"];
   userSongs: StateType["userSongs"];
   adminSongs: StateType["adminSongs"];
   userPlaylists: StateType["userPlaylists"];
   adminPlaylists: StateType["adminPlaylists"];
   setUserSongs: (userSongs: Song[]) => void;
   setAdminSongs: (adminSongs: Song[]) => void;
   setUserPlaylists: (userPlaylists: Playlist[], adminPlaylists: Playlist[]) => void;
   setAdminPlaylists: (adminPlaylists: Playlist[]) => void;
   initSongsContext: ({
      userSongs,
      adminSongs,
      userPlaylists,
      adminPlaylists,
   }: // user.
   {
      // user. User | undefined;
      userSongs?: Song[];
      adminSongs?: Song[];
      userPlaylists?: Playlist[];
      adminPlaylists?: Playlist[];
   }) => void;
};

const useSongsStore = (): UseSongsHookType => {
   const {
      state: { adminPlaylists, adminSongs, initial, userPlaylists, userSongs },
      initSongsContext,
      setUserSongs,
      setUserPlaylists,
      setAdminPlaylists,
      setAdminSongs,
   } = useContext(SongsContext);

   return {
      // user.
      adminPlaylists,
      adminSongs,
      initial,
      userPlaylists,
      userSongs,
      initSongsContext,
      setUserSongs,
      setAdminSongs,
      setUserPlaylists,
      setAdminPlaylists,
   };
};

export default SongsProvider;

export { SongsContext, initialSongs, useSongsStore };

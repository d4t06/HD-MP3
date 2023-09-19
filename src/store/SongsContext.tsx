import { createContext, useCallback, useContext, useReducer } from "react";
import { Playlist, Song, User } from "../types";
import { Timestamp } from "firebase/firestore";

// only change user song, user playlist

type StateType = {
   userSongs: Song[];
   adminSongs: Song[];

   userPlaylists: Playlist[];
   adminPlaylists: Playlist[];

   userData: User;

   initial: boolean;
};

const initialSongs: StateType = {
   userSongs: [],
   userPlaylists: [],

   adminSongs: [],
   adminPlaylists: [],

   userData: {
      display_name: "",
      email: "",
      photoURL: "",
      playlist_ids: [],
      song_ids: [],
      role: "",
      songs_count: 0,
      latest_seen: new Timestamp(0, 0),
   },

   initial: false,
};

const enum REDUCER_ACTION_TYPE {
   SETUSERSONGS,
   SETUSERPLAYLISTS,
   INIT,
}

type ReducerAction = {
   type: REDUCER_ACTION_TYPE;
   payload: {
      userSongs?: Song[];
      userPlaylists?: Playlist[];

      adminSongs?: Song[];
      adminPlaylists?: Playlist[];

      userData?: User;
   };
};

// reducer
const reducer = (state: StateType, action: ReducerAction): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.INIT:
         return {
            userSongs: action.payload.userSongs || [],
            adminSongs: action.payload.adminSongs || [],

            userPlaylists: action.payload.userPlaylists || [],
            adminPlaylists: action.payload.adminPlaylists || [],

            userData: action.payload.userData || state.userData,
            initial: true,
         };
      case REDUCER_ACTION_TYPE.SETUSERSONGS:
         return {
            userSongs: action.payload.userSongs || [],
            adminSongs: state.adminSongs,

            userPlaylists: state.userPlaylists,
            adminPlaylists: state.adminPlaylists,

            userData: state.userData,
            initial: state.initial,
         };
      case REDUCER_ACTION_TYPE.SETUSERPLAYLISTS:
         return {
            adminSongs: state.adminSongs,
            userSongs: state.userSongs,

            userPlaylists: action.payload.userPlaylists || [],
            adminPlaylists: state.adminPlaylists,

            userData: state.userData,
            initial: state.initial,
         };
      default:
         return {
            adminSongs: state.adminSongs,
            userSongs: state.userSongs,

            userPlaylists: state.userPlaylists,
            adminPlaylists: state.adminPlaylists,

            userData: state.userData,
            initial: state.initial,
         };
   }
};

// actions
const useSongsContext = (songsStore: StateType) => {
   const [state, dispatch] = useReducer(reducer, songsStore);

   const setUserSongs = useCallback((userSongs: Song[]) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.SETUSERSONGS,
         payload: { userSongs },
      });
   }, []);

   const initSongsContext = useCallback(
      ({
         userSongs,
         adminSongs,
         userPlaylists,
         adminPlaylists,
         userData,
      }: {
         userData: User;
         userSongs: Song[];
         adminSongs: Song[];
         userPlaylists: Playlist[];
         adminPlaylists: Playlist[];
      }) => {
         // console.log("set songs payload");
         dispatch({
            type: REDUCER_ACTION_TYPE.INIT,
            payload: { userSongs, adminSongs, userPlaylists, adminPlaylists, userData },
         });
      },
      []
   );

   const setUserPlaylists = useCallback((userPlaylists: Playlist[]) => {
      // console.log("set songs payload");
      dispatch({
         type: REDUCER_ACTION_TYPE.SETUSERPLAYLISTS,
         payload: { userPlaylists },
      });
   }, []);

   return { state, setUserSongs, initSongsContext, setUserPlaylists };
};

type UseSongsContextType = ReturnType<typeof useSongsContext>;

const initialContextState: UseSongsContextType = {
   state: initialSongs,
   setUserSongs: () => {},
   initSongsContext: () => {},
   setUserPlaylists: () => {},
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

type UseSongsHookType = {
   userData: StateType["userData"];
   initial: StateType["initial"];
   userSongs: StateType["userSongs"];
   adminSongs: StateType["adminSongs"];
   userPlaylists: StateType["userPlaylists"];
   adminPlaylists: StateType["adminPlaylists"];
   setUserSongs: (userSongs: Song[]) => void;
   setUserPlaylists: (userPlaylists: Playlist[], adminPlaylists: Playlist[]) => void;
   initSongsContext: ({
      userSongs,
      adminSongs,
      userPlaylists,
      adminPlaylists,
      userData,
   }: {
      userData: User;
      userSongs: Song[];
      adminSongs: Song[];
      userPlaylists: Playlist[];
      adminPlaylists: Playlist[];
   }) => void;
};

const useSongsStore = (): UseSongsHookType => {
   const {
      state: { userData, adminPlaylists, adminSongs, initial, userPlaylists, userSongs },
      initSongsContext,
      setUserSongs,
      setUserPlaylists,
   } = useContext(SongsContext);

   return {
      userData,
      adminPlaylists,
      adminSongs,
      initial,
      userPlaylists,
      userSongs,
      initSongsContext,
      setUserSongs,
      setUserPlaylists,
   };
};

export default SongsProvider;

export { SongsContext, initialSongs, useSongsStore };

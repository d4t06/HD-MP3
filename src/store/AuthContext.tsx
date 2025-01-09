import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

// 1 initial state
type StateType = {
  user: User | null;
  loading: boolean;
};
const initialState: StateType = {
  user: null,
  loading: true,
};

// 2 reducer
const enum REDUCER_ACTION_TYPE {
  SETUSER,
  RESET,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload: {
    user: StateType["user"];
    history_song_ids?: string[];
  };
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SETUSER:
      const payload = action.payload;

      return {
        user: payload.user,
        loading: false,
      };
    case REDUCER_ACTION_TYPE.RESET:
      return {
        user: null,
        loading: true,
      };
    default:
      return {
        user: state.user,
        loading: state.loading,
      };
  }
};

type SetUser = {
  type: "set-user";
  user: StateType["user"];
};

type Reset = {
  type: "reset";
};

type SetUserType = SetUser | Reset;

// 3 initial context
type ContextType = {
  state: StateType;
  setUser: (payload: SetUserType) => void;
};

const initialContext: ContextType = {
  state: {
    user: initialState.user,
    loading: true,
  },
  setUser: () => {},
};

// 4 create context
const AuthContext = createContext<ContextType>(initialContext);

// 5 hook
const useAuthContext = (): ContextType => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = useCallback((payload: SetUserType) => {
    switch (payload.type) {
      case "set-user":
        console.log("set user");
        return dispatch({
          type: REDUCER_ACTION_TYPE.SETUSER,
          payload: { user: payload.user },
        });
      case "reset":
        console.log("reset user");

        return dispatch({
          type: REDUCER_ACTION_TYPE.RESET,
          payload: { user: null },
        });
    }
  }, []);

  return { state: { loading: state.loading, user: state.user }, setUser };
};

// 6 context provider
const AuthProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const {
    state: { loading, user },
    setUser,
  } = useAuthContext();

  return (
    <AuthContext.Provider value={{ state: { loading, user }, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6 hook
const useAuthStore = () => {
  const {
    state: { loading, user },
    setUser,
  } = useContext(AuthContext);

  return { loading, user, setUser };
};

const useAuthActions = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const logOut = async () => {
    await signOut(auth);
    location.reload();
  };

  const logIn = () => {
    signInWithGoogle();
  };

  return { logOut, logIn };
};

export default AuthProvider;
export { useAuthStore, initialState, useAuthActions };

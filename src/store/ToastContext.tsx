// init state

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { nanoid } from "nanoid";

type StateType = {
  toasts: Toast[];
};
const initialState: StateType = {
  toasts: [],
};

// create context
// we expect {
//    state: {...props},
//    setState
//    ...
// }
type ContextType = {
  state: StateType;
  setToasts: Dispatch<SetStateAction<Toast[]>>;
  setErrorToast: (message?: string) => void;
  setSuccessToast: (message?: string) => void;
};

const initialContext: ContextType = {
  state: initialState,
  setToasts: () => {},
  setErrorToast: () => {},
  setSuccessToast: () => {},
};

const ToastContext = createContext(initialContext);

// define context provider
const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setErrorToast = (message?: string) =>
    setToasts((t) => [
      ...t,
      { title: "error", id: nanoid(4), desc: message || "Somethings went wrong" },
    ]);

  const setSuccessToast = (message?: string) =>
    setToasts((t) => [
      ...t,
      { title: "success", id: nanoid(4), desc: message || "Successful" },
    ]);

  return (
    <ToastContext.Provider
      value={{ state: { toasts }, setToasts, setErrorToast, setSuccessToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// define useToast Hook
const useToast = () => {
  const {
    state: { toasts },
    setToasts,
    setErrorToast,
    setSuccessToast,
  } = useContext(ToastContext);
  return { toasts, setToasts, setErrorToast, setSuccessToast };
};

export default ToastProvider;
export { useToast };

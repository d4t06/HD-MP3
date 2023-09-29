// init state

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Toast } from "../types";

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
};

const initialContext: ContextType = {
   state: initialState,
   setToasts: () => {},
};

const ToastContext = createContext(initialContext);


// define context provider
const ToastProvider = ({ children }: { children: ReactNode }) => {
   const [toasts, setToasts] = useState<Toast[]>([]);

   return (
      <ToastContext.Provider value={{ state: { toasts }, setToasts }}>
         {children}
      </ToastContext.Provider>
   );
};


// define useToast Hook 
const useToast = () => {
   const {state: {toasts}, setToasts} = useContext(ToastContext); 
   return {toasts, setToasts}
}

export default ToastProvider;
export {useToast}
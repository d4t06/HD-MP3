// init state
import { ReactNode, createContext, useContext, useState } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setErrorToast = (message?: string) =>
    setToasts((t) => [
      ...t,
      { variant: "error", id: Date.now() + "", desc: message || "Somethings went wrong" },
    ]);

  const setSuccessToast = (message?: string) =>
    setToasts((t) => [
      ...t,
      { variant: "success", id: Date.now() + "", desc: message || "Successful" },
    ]);

  return { toasts, setErrorToast, setSuccessToast, setToasts };
};

type ContextType = ReturnType<typeof useToast>;

const ToastContext = createContext<ContextType | null>(null);

// define context provider
export default function ToastProvider({ children }: { children: ReactNode }) {
  return <ToastContext.Provider value={useToast()}>{children}</ToastContext.Provider>;
}

// define useToast Hook
export const useToastContext = () => {
  const ct = useContext(ToastContext);
  if (!ct) throw new Error("Toast Context not provided")
  return ct;
};

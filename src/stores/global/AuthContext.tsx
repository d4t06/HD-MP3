import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const justRegistered = useRef(false);

  const updateUserData = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return { user, setUser, loading, setLoading, updateUserData, justRegistered };
};

type ContextType = ReturnType<typeof useAuth>;

const Context = createContext<ContextType | null>(null);

export function useAuthContext() {
  const ct = useContext(Context);
  if (!ct) throw new Error("auth context not Provided");

  return ct;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useAuth()}>{children}</Context.Provider>;
}

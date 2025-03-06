import PersistAuth from "@/modules/persist-auth";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const justRegistered = useRef(false);

  return { user, setUser, loading, setLoading, justRegistered };
};

type ContextType = ReturnType<typeof useAuth>;

const Context = createContext<ContextType | null>(null);

export function useAuthContext() {
  const ct = useContext(Context);
  if (!ct) throw new Error("auth context not Provided");

  return ct;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Context.Provider value={useAuth()}>
      <PersistAuth>{children}</PersistAuth>
    </Context.Provider>
  );
}

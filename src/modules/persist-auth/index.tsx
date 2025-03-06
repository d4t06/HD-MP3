import { ReactNode } from "react";
import usePersistAuth from "./_hooks/usePersistAuth";

export default function PersistAuth({ children }: { children: ReactNode }) {
  usePersistAuth();

  return children;
}

import { ReactNode } from "react";

export default function Center({ children }: { children: ReactNode }) {
   return (
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         {children}
      </span>
   );
}

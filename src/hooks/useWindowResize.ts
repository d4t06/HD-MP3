import { useEffect } from "react";

export default function useWindowResize(cb: () => void, dep: any[]) {
   useEffect(() => {
      if (!cb) return;

      cb();
      window.addEventListener("resize", cb);
      return () => {
         window.removeEventListener("resize", cb);
      };
   }, [...dep]);
}

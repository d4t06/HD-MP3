import { useEffect, useRef, useState } from "react";

export default function useIdle() {
   const [idle, setIdle] = useState(false);
   const timerId = useRef<NodeJS.Timeout>();

   useEffect(() => {
      timerId.current = setTimeout(() => {
         setIdle(false);
      }, 6000);

      return () => {
         clearTimeout(timerId.current);
      };
   }, [idle]);

   useEffect(() => {
      const handleMouseMove = () => {
         setIdle(true);
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         if (timerId.current) {
            clearTimeout(timerId.current);
         }
      };
   }, []);
}

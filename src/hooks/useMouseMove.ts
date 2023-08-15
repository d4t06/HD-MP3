import { useEffect, useRef, useState } from "react";

const useMouseMove = (isOpenFullScreen: boolean) => {

   const [isMove, setIsMove] = useState<number>();
   const [idle, setIdle] = useState<boolean>(false)

   const timerId = useRef<number>();



   const handleMouseMove = () => {
      setIsMove(Math.random());
      setIdle(false);
   };

   useEffect(() => {
      if (!isOpenFullScreen) return;

      const handleMouseMove = () => {
         setIsMove(Math.random());
         setIdle(false);
      };
      // window.addEventListener("mousemove", handleMouseMove);

      // return () => window.removeEventListener("mousemove", handleMouseMove);
   }, [isOpenFullScreen]);

   useEffect(() => {
      timerId.current = setTimeout(() => {
         if (!isMove) return;
         setIsMove(0);
         setIdle(true)
      }, 3000);

      return () => {
         clearTimeout(timerId.current);
      };
   }, [isMove]);


   return idle;
}

export default useMouseMove;
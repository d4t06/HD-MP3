import { useEffect, useState } from "react";

export default function useMobileRotate() {
   const [isLandscape, setIsLandscape] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 549 && window.innerWidth < 800) setIsLandscape(true);
         else setIsLandscape(false);
      };

      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return { isLandscape };
}

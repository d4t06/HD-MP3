import { useEffect, useRef, useState } from "react";
import Skeleton from "../skeleton";

export default function Image({ src, classNames }: { src?: string, classNames?: string }) {
   const [imageLoaded, setImageLoaded] = useState(false);
   const imageRef = useRef<HTMLImageElement>(null);

   useEffect(() => {
      // if no have image (use default placeholder png)
      if (!src) {
         setImageLoaded(true);
         return;
      }

      const imageEle = imageRef.current as HTMLImageElement;

      const handleLoadImage = () => {

         console.log('image loaded');
         setImageLoaded(true);
      };

      if (imageEle) {
         imageEle.addEventListener("load", handleLoadImage);
      }

      return () => {
         if (imageEle) {
            imageEle.removeEventListener("load", handleLoadImage);
         }
      };

   }, []);

   return (
      <>
         {!imageLoaded && <Skeleton className="w-full pt-[100%]" />}
         <img className={`${classNames && classNames} w-full ${!imageLoaded ? "hidden" : ""}`} src={src || "https://placehold.co/100"} ref={imageRef} />
      </>
   );
}

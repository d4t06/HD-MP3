import { useEffect, useRef, useState } from "react";
import Skeleton from "../skeleton";

type Props = {
   src?: string;
   classNames?: string;
   onError?: () => void;
};

export default function Image({ src, classNames, onError }: Props) {
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
         console.log('image loadded');
         
         setImageLoaded(true);
      };

      const defaultHandleError = () => {
         const imageEle = imageRef.current as HTMLImageElement;
         imageEle.src = "https://placehold.co/100";
         setImageLoaded(true);
      };

      const handleError = () => {
         onError ? onError() : defaultHandleError();
      };

      if (imageEle) {
         imageEle.addEventListener("load", handleLoadImage);
         imageEle.addEventListener("error", handleError);
      }

      return () => {
         if (imageEle) {
            imageEle.removeEventListener("load", handleLoadImage);
            imageEle.removeEventListener("error", handleError);
         }
      };
   }, []);

   return (
      <>
         {!imageLoaded && <Skeleton className="w-full pt-[100%]" />}
         <img
            className={`${classNames && classNames} w-full ${!imageLoaded ? "hidden" : ""}`}
            src={src || "https://placehold.co/100"}
            ref={imageRef}
         />
      </>
   );
}

import { useEffect, useRef, useState } from "react";
import Skeleton from "../skeleton";
import { Blurhash } from "react-blurhash";

type Props = {
   src?: string;
   classNames?: string;
   blurHashEncode?: string;
   onError?: () => void;
};

export default function Image({ src, classNames, blurHashEncode, onError }: Props) {
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

         setImageLoaded(true);
      };

      const defaultHandleError = () => {
         console.log('default err');
         
         const imageEle = imageRef.current as HTMLImageElement;
         imageEle.src = "https://placehold.co/100";
         setImageLoaded(true);
      };

      const handleError = () => {
         !!onError ? [onError(), defaultHandleError()] : defaultHandleError();
      };

      if (imageEle) {
         imageEle.addEventListener("load", handleLoadImage);
         imageEle.addEventListener("error", handleError);
      }

      return () => {
         const imageEle = imageRef.current as HTMLImageElement;

         if (imageEle) {
            imageEle.removeEventListener("load", handleLoadImage);
            imageEle.removeEventListener("error", handleError);
         }
      };
   }, []);

   return (
      <>
         {!imageLoaded && (
            <>
               {blurHashEncode ? (
                  <Blurhash
                     hash={blurHashEncode}
                     height={"100%"}
                     width={"100%"}
                     className="pt-[100%]"
                  />
               ) : (
                  <Skeleton className="w-full pt-[100%]" />
               )}
            </>
         )}
         <img
            className={`${classNames ? classNames : ''} w-full ${!imageLoaded ? "hidden" : ""}`}
            src={src || "https://placehold.co/100"}
            ref={imageRef}
         />
      </>
   );
}

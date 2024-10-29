import { useRef, useState } from "react";
import Skeleton from "../skeleton";
import { Blurhash } from "react-blurhash";
import logo from '@/assets/logo.png'

type Props = {
   src?: string;
   className?: string;
   blurHashEncode?: string;
   onError?: () => void;
};

export default function Image({ src, className, blurHashEncode, onError }: Props) {
   const [imageLoaded, setImageLoaded] = useState(false);
   const imageRef = useRef<HTMLImageElement>(null);

   const handleLoadImage = () => {
      setImageLoaded(true);

      if (!src) return;
      if (src?.includes("blob")) {
         URL.revokeObjectURL(src);
      }
   };

   const defaultHandleError = () => {
      const imageEle = imageRef.current as HTMLImageElement;
      imageEle.src = "https://placehold.co/100";
      setImageLoaded(true);
   };

   const handleError = () => {
      !!onError ? [onError(), defaultHandleError()] : defaultHandleError();
   };

   return (
      <>
         {!imageLoaded && (
            <>
               {blurHashEncode ? (
                  <Blurhash hash={blurHashEncode} height={"100%"} width={"100%"} />
               ) : (
                  <Skeleton className="w-full h-0" />
               )}
            </>
         )}
         <img
            onLoad={handleLoadImage}
            onError={handleError}
            className={`${className || ""} w-full ${
               !imageLoaded ? "hidden" : ""
            }`}
            src={src || logo}
            ref={imageRef}
         />
      </>
   );
}

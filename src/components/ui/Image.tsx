import { useEffect, useRef, useState } from "react";
import Skeleton from "../skeleton";

export default function Image({ src }: { src: string }) {
   const [imageLoaded, setImageLoaded] = useState(false);
   const imageRef = useRef<HTMLImageElement>(null);

   useEffect(() => {
      const imageEle = imageRef.current as HTMLImageElement;

      const handleLoadImage = () => {
         // console.log("image loaded");
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

   // console.log("check imageLoaed", imageLoaded);

   return (
      <>
         {!imageLoaded && <Skeleton className="w-full pt-[100%]" />}
         <img className={`${!imageLoaded ? "hidden" : ""}`} src={src} ref={imageRef} />
      </>
   );
}

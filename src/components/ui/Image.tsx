import { useRef, useState } from "react";
import Skeleton from "../skeleton";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";
// import songImage from '@/assets/song-image.png'

type Props = {
  src?: string;
  className?: string;
  width?: string;
  blurHashEncode?: string;
  onError?: () => void;
};

export default function Image({
  src,
  className = "",
  width = "w-full",
  blurHashEncode,
  onError,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleLoadImage = () => {
    if (import.meta.env.DEV) {
      setTimeout(() => setImageLoaded(true), 300);
    } else setImageLoaded(true);

    if (!src) return;
    if (src?.includes("blob")) {
      URL.revokeObjectURL(src);
    }
  };

  const defaultHandleError = () => {
    const imageEle = imageRef.current as HTMLImageElement;
    imageEle.src = "https://placehold.co/400";
    setImageLoaded(true);
  };

  const handleError = () => {
    console.log("image error");
    !!onError ? [onError(), defaultHandleError()] : defaultHandleError();
  };

  return (
    <>
      {!imageLoaded && (
        <>
            <Blurhash hash={blurHashEncode || defaultBlurhash} className="rounded-md overflow-hidden" height={"100%"} width={"100%"} />
          
        </>
      )}
      <img
        onLoad={handleLoadImage}
        onError={handleError}
        className={`${className} ${width} ${!imageLoaded ? "hidden" : ""}`}
        src={src || "https://placehold.co/400"}
        ref={imageRef}
      />
    </>
  );
}

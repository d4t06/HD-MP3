import { useRef, useState } from "react";
import Skeleton from "../skeleton";
import { Blurhash } from "react-blurhash";
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
    setImageLoaded(true);

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
        className={`${className} ${width} ${!imageLoaded ? "hidden" : ""}`}
        src={src || "https://placehold.co/400"}
        ref={imageRef}
      />
    </>
  );
}

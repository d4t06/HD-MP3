import { useRef, useState } from "react";
import { Blurhash } from "react-blurhash";
import { defaultBlurhash } from "@/constants/app";

type Props = {
  src?: string;
  className?: string;
  width?: string;
  blurHashEncode?: string;
  onError?: () => void;
  fallback?: string;
};

export default function Image({
  src,
  className = "",
  width = "w-full",
  blurHashEncode,
  onError,
  fallback,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleLoadImage = () => {
    setTimeout(() => setImageLoaded(true), 200);

    if (!src) return;
    if (src?.includes("blob")) {
      URL.revokeObjectURL(src);
    }
  };

  const defaultHandleError = () => {
    const imageEle = imageRef.current as HTMLImageElement;
    imageEle.src = fallback || "https://placehold.co/400";
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
          <Blurhash
            hash={blurHashEncode || defaultBlurhash}
            className={`overflow-hidden ${className}`}
            height={"100%"}
            width={"100%"}
          />
        </>
      )}
      <img
        onLoad={handleLoadImage}
        onError={handleError}
        className={`${className} ${width} ${!imageLoaded ? "hidden" : ""}`}
        src={src || "https://placehold.co/500"}
        ref={imageRef}
      />
    </>
  );
}

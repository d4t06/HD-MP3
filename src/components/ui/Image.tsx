import { ReactEventHandler, useRef, useState } from "react";
import { Blurhash } from "react-blurhash";
import { choVoTri } from "@/constants/app";

type Props = {
  src?: string;
  className?: string;
  width?: string;
  blurHashEncode?: string;
  onError?: () => void;
  onLoad?: ReactEventHandler<HTMLImageElement>;
  fallback?: string;
};

export default function Image({
  src,
  className = "",
  width = "w-full",
  blurHashEncode,
  onError,
  onLoad,
  fallback,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleLoadImage: ReactEventHandler<HTMLImageElement> = (e) => {
    setTimeout(() => setImageLoaded(true), 200);

    if (!src) return;
    if (src?.includes("blob")) {
      URL.revokeObjectURL(src);
    }

    onLoad && onLoad(e);
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
            hash={blurHashEncode || choVoTri.blurhash}
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
        src={src || choVoTri.image}
        ref={imageRef}
      />
    </>
  );
}

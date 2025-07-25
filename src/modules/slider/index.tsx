import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useSlider from "./useSlider";
import { Image } from "@/components";
import { Link } from "react-router-dom";

interface ImageSliderProps {
  images: { imageUrl: string; link?: string }[];
  className?: string;
  autoPlay?: boolean;
}

export default function ImageSlider({
  images,
  autoPlay = false,
  className = "",
}: ImageSliderProps) {
  const { next, previous, currentIndex } = useSlider({
    images,
    autoPlay,
  });

  if (!images || images.length === 0) {
    return <Image className="" />;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-full overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((data, index) => (
            <Link
              to={data.link || ""}
              key={index}
              className="w-full h-full flex-shrink-0"
            >
              <Image src={data.imageUrl} className="h-full object-cover" />
            </Link>
          ))}
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <button
                className="p-1.5"
                onClick={previous}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-4" />
              </button>
            </div>

            <div className="!absolute right-4 top-1/2 transform -translate-y-1/2">
              <button className="p-1.5" onClick={next} aria-label="Next image">
                <ChevronRightIcon className="w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

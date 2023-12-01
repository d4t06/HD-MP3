import { useRef } from "react";

import useSlider from "../hooks/useImageSlider";
import { Button } from ".";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

function ImageSlider({
  images,
  className,
}: {
  images: string[];
  className: string;
}) {
  const imageSliderRef = useRef<HTMLDivElement>(null);

  // use hooks
  const { attributeObj, curIndex, imageWidth, next, previous } = useSlider({
    imageSliderRef,
    data: images,
    autoSlide: 6000,
  });

  const classes = {
    container: "width-[100%] rounded-[16px] overflow-hidden whitespace-nowrap",
    btn: "absolute h-[40px] w-[40px] top-[50%] translate-y-[-50%] opacity-[.7] hover:opacity-[1]",
    index: "absolute bottom-[8px] left-[8px] z-10",
    imageItem: "absolute bottom-[8px] left-[8px] z-10",
  };

  return (
    <div className={`relative ${className || ""}`} {...attributeObj}>
      <div
        className={
          "width-[100%] rounded-[16px] overflow-hidden whitespace-nowrap"
        }
        ref={imageSliderRef}
      >
        <Button
          variant={"circle"}
          className={`${classes.btn} left-[15px]`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={previous}
        >
          <ChevronLeftIcon className="w-[25px]" />
        </Button>

        <Button
          variant={"circle"}
          className={`${classes.btn} right-[15px]`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={next}
        >
          <ChevronLeftIcon className="w-[25px]" />
        </Button>

        <div className={classes.index || ""}>
          <span>{curIndex}</span> / <span>{images.length}</span>
        </div>
        {images.length ? (
          images.map((item, index) => {
            return (
              <div
                key={index}
                style={{ width: imageWidth }}
                className={classes.imageItem}
              >
                <img src={item} alt="" className="w-full" />
              </div>
            );
          })
        ) : (
          <h2>Data is not array</h2>
        )}
      </div>
    </div>
  );
}

export default ImageSlider;

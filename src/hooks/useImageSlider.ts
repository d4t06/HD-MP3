import {
  useEffect,
  useRef,
  useState,
  MouseEvent,
  RefObject,
  DOMAttributes,
} from "react";

export default function useSlider({
  data,
  imageSliderRef,
  autoSlide,
}: {
  data: string[];
  imageSliderRef: RefObject<HTMLDivElement>;
  autoSlide: number;
}) {
//   const [data, setImages] = useState<string[]>([]);
  const [curIndex, setCurIndex] = useState(1);
  const [isEnter, setIsEnter] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDrag, setIsDrag] = useState(false);

  const prevScrollRef = useRef(0);
  const prevPageXRef = useRef(0);
  const scrollRef = useRef(0);
  const timerId = useRef<NodeJS.Timeout>();

  const handleStartDrag = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const isFinish = checkIsScrollFinish(curIndex);
    if (!isFinish) return;

    setIsDrag(true);

    prevPageXRef.current = e.pageX;
    const imageSliderEle = imageSliderRef.current;

    if (!imageSliderEle) return;

    imageSliderEle.style.scrollBehavior = "auto";
  };

  const getNewIndex = () => {
    let newIndex = curIndex;
    const distance = scrollRef.current - prevScrollRef.current;
    const minimum = imageWidth / 4;

    console.log("check distance", distance);

    if (distance > 0) {
      if (newIndex === data.length) newIndex -= 1;
      else if (Math.abs(distance) > minimum) newIndex += 1;
    } else if (distance < 0) {
      if (newIndex === 1) newIndex += 1;
      else if (Math.abs(distance) > minimum) newIndex -= 1;
    }

    return newIndex;
  };

  const handleMouseLeave = () => {
    setIsEnter(false);
    if (isDrag) handleStopDrag();
  };

  const handleDrag = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    if (!isDrag) return;
    setIsDrag(true);

    const distance = e.pageX - prevPageXRef.current;
    const newScrollLeft = prevScrollRef.current - distance;

    const isValid = newScrollLeft > 0 && newScrollLeft < maxScroll;

    if (isValid) {
      const sliderEle = imageSliderRef.current;
      if (!sliderEle) return;

      sliderEle.scrollLeft = newScrollLeft;
    }
    scrollRef.current = newScrollLeft;
  };

  const handleStopDrag = () => {
    if (!isDrag) return;
    setIsDrag(false);

    if (scrollRef.current === prevScrollRef.current) return;
    if (scrollRef.current === 0 || scrollRef.current === maxScroll) return;

    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;

    sliderEle.style.scrollBehavior = "smooth";

    const newIndex = getNewIndex();
    if (newIndex === curIndex) {
      sliderEle.scrollLeft = prevScrollRef.current;
    } else {
      setCurIndex(newIndex);
    }
    scrollRef.current = 0;
  };

  // important function
  const checkIsScrollFinish = (curIndex: number) => {
    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;

    const expectScroll = (curIndex - 1) * imageWidth;
    const diff = Math.ceil(sliderEle.scrollLeft) - Math.ceil(expectScroll);

    return !(Math.abs(diff) > 1);
  };

  const next = () => {
    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;
    sliderEle.style.scrollBehavior = "smooth";

    setCurIndex((prev) => {
      const isFinish = checkIsScrollFinish(prev);
      if (isFinish) {
        if (prev === data.length) {
          return 1;
        } else {
          return prev + 1;
        }
      } else return prev;
    });
  };

  const previous = () => {
    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;

    sliderEle.style.scrollBehavior = "smooth";

    const isFinish = checkIsScrollFinish(curIndex);
    if (!isFinish) return;

    if (curIndex === 1) {
      setCurIndex(data.length);
    } else {
      setCurIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;
    const width = Math.ceil(sliderEle.clientWidth);

    sliderEle.style.width = `${width}px`;

    // setImages(data);
    setMaxScroll(width * data.length);
    setImageWidth(width);

    return () => {
      setCurIndex(1);
      if (sliderEle) {
        sliderEle.style.scrollBehavior = "auto";
        sliderEle.scrollLeft = 0;
      }
    };
  }, [data]);

  useEffect(() => {
    const sliderEle = imageSliderRef.current;
    if (!sliderEle) return;

    const needToScroll = (curIndex - 1) * imageWidth;
    sliderEle.scrollLeft = needToScroll;
    prevScrollRef.current = needToScroll;
  }, [curIndex, imageWidth]);

  // problem
  useEffect(() => {
    if (isEnter) return;
    if (!autoSlide) return;
    if (!data.length) return;

    timerId.current = setInterval(() => {
      console.log("auto slide");
      next();
    }, autoSlide);

    return () => {
      if (timerId.current) {
        console.log("clear");
        clearInterval(timerId.current);
      }
    };
  }, [isEnter, data]);

  const attributeObj: DOMAttributes<HTMLElement> = {
    onMouseDown: (e) => handleStartDrag(e),
    onMouseUp: () => handleStopDrag(),
    onMouseMove: (e) => handleDrag(e),
    onMouseEnter: () => setIsEnter(true),
    onMouseLeave: () => handleMouseLeave(),
  };

  return {
    attributeObj,
    next,
    previous,
    curIndex,
    imageWidth,
  };
}

import { FC, useEffect, useRef } from "react";
import { Song } from "../../types";
import Button from "./Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  data: Song;
  active: boolean;
  onClick?: () => void;
  containerEle?: HTMLElement;
  hasHover?: boolean;
  hasTitle?:boolean
}

const SongThumbnail: FC<Props> = ({
  data,
  active,
  hasHover, 
  onClick,
  containerEle,
  hasTitle
}) => {
  const thumbnail = useRef<HTMLDivElement>(null);
  const node = thumbnail.current as HTMLElement;

  useEffect(() => {
    if (containerEle && active) {
      const windowWidth = window.innerWidth;

      const rect = node.getBoundingClientRect();

      const lefDiff = rect.left;
      const rightDiff = windowWidth - (lefDiff + node.offsetWidth);

      const needToScroll = Math.abs(lefDiff - rightDiff) / 2;

      
      // if element not in screen
      if (
        Math.abs(lefDiff) > windowWidth ||
        Math.abs(rightDiff) > windowWidth
      ) {
        containerEle.style.scrollBehavior = "auto";
      }

      // on the left side
      if (rightDiff > lefDiff) {
        setTimeout(() => {
          containerEle.scrollLeft = containerEle.scrollLeft - needToScroll;
          containerEle.style.scrollBehavior = "smooth";
        }, 300);

        // on the right side
      } else if (rightDiff < lefDiff) {
        setTimeout(() => {
          containerEle.scrollLeft = containerEle.scrollLeft + needToScroll;
          containerEle.style.scrollBehavior = "smooth";
        }, 300);
      }
    }
  }, [active]);

  return (
    <div ref={thumbnail} className={`flex flex-col `}>
      <div
        className={`h-[350px] w-[350px] flex justify-center max-[549px]:h-[auto] max-[549px]:w-[100%]`}
      >
        <div
          className={`group relative ${
            active
              ? "w-[350px] max-[549px]:w-[70%]"
              : "w-[250px] max-[549px]:w-[100%]"
          } transition-[width] duration-300 origin-top self-end`}
        >
          <img
            className={`select-none object-cover object-center`}
            src={data.image}
            alt=""
          />

          {hasHover && (
            <div
              className="absolute inset-0 bg-black bg-opacity-60 
             items-center justify-center hidden max-[549px]:hidden group-hover:flex"
            >
              <Button
                onClick={onClick}
                variant={"circle"}
                className="h-[50px] w-[50px] text-white"
              >
                <PauseCircleIcon />
              </Button>
            </div>
          )}

          {active && (
            <div className="absolute h-[30px] w-[30px] bottom-[15px] left-[15px]">
              <img
                src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                alt=""
              />
            </div>
          )}
        </div>
      </div>

      {hasTitle &&
      <div>
        <h2 className="text-3xl text-center font-bold mt-[14px] max-[549px]:text-xl">
          {data.name}
        </h2>
        <p className="text-center text-lg mt-[7px] text-gray-500">
          {data.singer}
        </p>
      </div>
      }
    </div>
  );
};

export default SongThumbnail;

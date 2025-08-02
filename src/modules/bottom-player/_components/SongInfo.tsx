import { ElementRef, useRef } from "react";
import { getHidden } from "@/utils/appHelpers";
import useVinyl from "../_hooks/useVinyl";
import { Image } from "@/components";
import ScrollText from "@/modules/scroll-text";
import { Link } from "react-router-dom";

type Props = {
  isOpenFullScreen: boolean;
  song?: Song;
};

export default function SongInfo({ isOpenFullScreen, song }: Props) {
  const vinylRef = useRef<ElementRef<"div">>(null);

  // hook
  useVinyl({ vinylRef });

  const classes = {
    songInfoChild: "flex flex-row",
  };

  return (
    <div className={`w-1/4  ${getHidden(isOpenFullScreen)}`}>
      <div className={`${classes.songInfoChild} ${getHidden(isOpenFullScreen)}`}>
        <div
          ref={vinylRef}
          className={`w-[56px] h-[56px] flex-shrink-0 animate-[spin_8s_linear_infinite]`}
        >
          <Image src={song?.image_url} className={`rounded-full h-full object-cover`} />
        </div>

        <div className="ml-2 flex-grow">
          <div className="h-[32px]">
            <ScrollText
              className="font-medium"
              content={song?.name || "Name"}
            />
          </div>
          {song && (
            <div className="leading-[1.2] text-sm opacity-[.7] line-clamp-1">
              {song.singers.map((s, i) =>
                s.id ? (
                  <Link
                    to={`/singer/${s.id}`}
                    className={`hover:text-[--primary-cl] hover:underline`}
                    key={i}
                  >
                    {(i ? ", " : "") + s.name}
                  </Link>
                ) : (
                  <span key={i}>{(i ? ", " : "") + s.name}</span>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

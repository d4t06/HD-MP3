import { ElementRef, useRef } from "react";
import { getHidden } from "@/utils/appHelpers";
import useVinyl from "../_hooks/useVinyl";
import { Image } from "@/components";
import ScrollText from "@/modules/scroll-text";
import { Link } from "react-router-dom";
import { choVoTri } from "@/constants/app";

type Props = {
  isOpenFullScreen: boolean;
  song?: Song;
};

export default function SongInfo({ isOpenFullScreen, song }: Props) {
  const vinylRef = useRef<ElementRef<"div">>(null);

  // hook
  useVinyl({ vinylRef });

  const classes = {
    songInfoChild: "flex items-center",
  };

  return (
    <div className={`w-1/4 ${getHidden(isOpenFullScreen)}`}>
      <div
        className={`${classes.songInfoChild} ${getHidden(isOpenFullScreen)}`}
      >
        <div
          ref={vinylRef}
          className={`w-[56px] h-[56px] flex-shrink-0 animate-[spin_8s_linear_infinite]`}
        >
          <Image
            src={song?.image_url || choVoTri.image}
            blurHashEncode={song?.blurhash_encode}
            className={`rounded-full h-full object-cover`}
          />
        </div>

        <div className="ml-2 font-bold flex-grow">
          <div className="h-6">
            <ScrollText className="" content={song?.name || "..."} />
          </div>
          {song && (
            <div className="leading-[1.2] text-sm opacity-70 line-clamp-1">
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

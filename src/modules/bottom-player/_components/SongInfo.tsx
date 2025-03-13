// import { useSelector } from "react-redux";
import { ElementRef, useRef } from "react";
import { getHidden } from "@/utils/appHelpers";
import useVinyl from "../_hooks/useVinyl";
import { Image } from "@/components";
import ScrollText from "@/modules/scroll-text";
import { Link } from "react-router-dom";
import { useThemeContext } from "@/stores";

type Props = {
  admin?: boolean;
  isOpenFullScreen: boolean;
  song?: Song;
};

export default function SongInfo({ isOpenFullScreen, admin, song }: Props) {
  const vinylRef = useRef<ElementRef<"div">>(null);
  const { theme } = useThemeContext();

  // hook
  useVinyl({ vinylRef });

  const classes = {
    songInfoWrapper: `${admin ? "w-1/4" : "w-1/4 "}`,
    songInfoChild: "flex flex-row",
  };

  return (
    <div className={`${classes.songInfoWrapper}  ${getHidden(isOpenFullScreen)}`}>
      <div className={`${classes.songInfoChild} ${getHidden(isOpenFullScreen)}`}>
        <div
          ref={vinylRef}
          className={`${
            admin ? `w-[46px]` : "w-[56px]"
          }  animate-[spin_8s_linear_infinite]`}
        >
          <Image src={song?.image_url} className={`rounded-full w-full`} />
        </div>

        <div className="ml-2 flex-grow">
          <div className="h-[32px]">
            <ScrollText
              className="leading-[1.5] font-playwriteCU"
              content={song?.name || "Name"}
            />
          </div>
          {song && (
            <div className="leading-[1.2] text-sm opacity-[.7]">
              {song.singers.map((s, i) => (
                <Link
                  to={`/singer/${s.id}`}
                  className={`${theme.content_hover_text}  hover:underline`}
                  key={i}
                >
                  {s.name + (i ? ", " : "")}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

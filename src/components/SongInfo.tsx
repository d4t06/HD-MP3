// import { useSelector } from "react-redux";
import { Image, ScrollText } from ".";
import { ElementRef, useRef } from "react";
import useVinyl from "../hooks/useVinyl";
import { getHidden } from "@/utils/appHelpers";

type Props = {
  admin?: boolean;
  isOpenFullScreen: boolean;
  song?: Song;
};

export default function SongInfo({ isOpenFullScreen, admin, song }: Props) {
  const vinylRef = useRef<ElementRef<"div">>(null);

  // hook
  useVinyl({ vinylRef });

  const classes = {
    songInfoWrapper: `${admin ? "w-1/4" : "w-1/4 "}`,
    songInfoChild: "flex flex-row",
  };

  return (
    <div className={`${classes.songInfoWrapper}  ${getHidden(isOpenFullScreen)}`}>
      <div className={`${classes.songInfoChild} ${getHidden(isOpenFullScreen)}`}>
        <div ref={vinylRef} className={`${admin ? `w-[46px]` : "w-[56px]"}  animate-[spin_8s_linear_infinite]`}>
          <Image
            src={song?.image_url}
            className={`rounded-full w-full`}
          />
        </div>

        <div className="ml-2 flex-grow">
          <div className="h-[32px]">
            <ScrollText
              className="leading-[1.5] font-playwriteCU"
              content={song?.name || "Name"}
            />
          </div>

          <div className="h-[20px]">
            <ScrollText
              autoScroll
              className="opacity-70 leading-[1.2]"
              content={song?.singer || "..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

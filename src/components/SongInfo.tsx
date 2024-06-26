import { useSelector } from "react-redux";
import { ScrollText } from ".";
import { ElementRef, useRef } from "react";
import logo from "../assets/siteLogo.png";
import useVinyl from "../hooks/useVinyl";
import { selectCurrentSong } from "@/store/currentSongSlice";

type Props = {
   admin?: boolean;
   isOpenFullScreen: boolean;
};

export default function SongInfo({ isOpenFullScreen, admin }: Props) {
   const vinylRef = useRef<ElementRef<"img">>(null);

   const { currentSong } = useSelector(selectCurrentSong);

   // hook
   useVinyl({ vinylRef });

   const classes = {
      songInfoWrapper: `${admin ? "w-1/4" : "w-1/4 "}`,
      songInfoChild: "flex flex-row items-center h-full origin-center",
   };

   return (
      <div className={`${classes.songInfoWrapper}  ${isOpenFullScreen ? "hidden" : ""}`}>
         <div className={`${classes.songInfoChild} ${isOpenFullScreen ? "hidden" : ""}`}>
            <div className={admin ? `w-[36px]` : "w-[46px]"}>
               <img
                  ref={vinylRef}
                  src={currentSong.image_url || logo}
                  className={`rounded-full w-full animate-[spin_8s_linear_infinite]`}
               />
            </div>

            <div className="ml-[10px] flex-grow">
               <div className="h-[24px] w-full mask-image-horizontal">
                  <ScrollText
                     autoScroll
                     classNames="text-[18px] font-[500]"
                     label={currentSong.name || "name"}
                  />
               </div>

               <div className="h-[20px] w-full mask-image-horizontal">
                  <ScrollText
                     autoScroll
                     classNames="text-[14px] opacity-60"
                     label={currentSong.singer || "singer"}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

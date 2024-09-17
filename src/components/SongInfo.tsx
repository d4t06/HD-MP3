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
      songInfoChild: "flex flex-row",
   };

   return (
      <div
         className={`${classes.songInfoWrapper}  ${
            isOpenFullScreen ? "hidden" : ""
         }`}
      >
         <div
            className={`${classes.songInfoChild} ${
               isOpenFullScreen ? "hidden" : ""
            }`}
         >
            <div className={admin ? `w-[46px]` : "w-[56px]"}>
               <img
                  ref={vinylRef}
                  src={currentSong.image_url || logo}
                  className={`rounded-full w-full animate-[spin_8s_linear_infinite]`}
               />
            </div>

            <div className="ml-2 flex-grow">
               <div className="h-[26px]">
                  <ScrollText
                     className="text-[14px] font-playwriteCU font-[600]"
                     content={currentSong.name || "Name"}
                  />
               </div>

               <div className="h-[20px]">
                  <ScrollText
                     autoScroll
                     className="text-[15px] font-[600] opacity-70"
                     content={currentSong.singer || "..."}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

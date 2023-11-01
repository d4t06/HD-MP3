import { ForwardedRef, forwardRef } from "react";
import { Song, ThemeType } from "../types";
import Button from "./ui/Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";
import playingIcon from "../assets/icon-playing.gif";
import { Image } from ".";
// import Image from "./ui/Image";

interface Props {
   data?: Song;
   active: boolean;
   onClick?: () => void;
   hasTitle?: boolean;
   classNames?: string;
   idleClass?: string;
   theme: ThemeType;
}

const SongThumbnail = (
   { data, active, onClick, hasTitle, classNames, theme, idleClass }: Props,
   ref: ForwardedRef<any>
) => {
   const classes = {
      container: "flex flex-col",
      imageFrame:
         "group relative transition-[width] duration-[.3s] origin-center rounded-[6px] overflow-hidden",
      image: "select-none object-cover object-center rounded w-full",
      overlay:
         "absolute inset-0 bg-[#333] bg-opacity-60 items-center justify-center hidden group-hover:flex",
      playingGifFrame: "absolute h-[30px] w-[30px] bottom-[15px] left-[15px]",
      title: "text-[22px] text-white mt-[10px] font-bold text-ellipsis line-clamp-1",
   };

   if (!data) return;

   return (
      <div ref={ref} className={`${classes.container} ${idleClass && idleClass}`}>
         <div className={`flex ${classNames && classNames}`}>
            <div
               className={`${classes.imageFrame} ${active ? "w-[320px]" : "w-[280px]"}`}
            >
               <Image classNames="rounded-[6px]" src={data.image_url} blurHashEncode={data.blurhash_encode}/>

               {/* <img
                  src={data.image_url || "https://placehold.co/100"}
                  className="w-full"
                  alt=""
               /> */}

               {!active && (
                  <div className={classes.overlay}>
                     <Button
                        onClick={onClick}
                        variant={"circle"}
                        className={`h-[50px] w-[50px] text-white ${theme.content_hover_text}`}
                     >
                        <PauseCircleIcon className="w-full" />
                     </Button>
                  </div>
               )}

               {/* playing gif */}
               {active && (
                  <div className={classes.playingGifFrame}>
                     <img src={playingIcon} alt="" />
                  </div>
               )}
            </div>
         </div>

         {hasTitle && (
            <div className="text-center">
               <h2 className={classes.title}>{data?.name || "Some song"}</h2>
               <p className="text-md opacity-50 line-clamp-1">{data?.singer || "..."}</p>
            </div>
         )}
      </div>
   );
};

export default forwardRef(SongThumbnail);

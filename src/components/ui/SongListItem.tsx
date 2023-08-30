import { useEffect, useRef } from "react";
import { Song, ThemeType } from "../../types";
import Button from "./Button";
import {
   Bars3Icon,
   HeartIcon,
   PauseCircleIcon,
} from "@heroicons/react/24/outline";
import handleTimeText from "../../utils/handleTimeText";

interface Props {
   data: Song;
   active?: boolean;
   autoScroll?: boolean;
   onClick?: () => void;
   theme: ThemeType & { alpha: string };
}

export default function SongListItem({
   data,
   active,
   autoScroll,
   onClick,
   theme,
}: Props) {
   // const [_favorite, setFavorite] = useLocalStorage("favorites", [""]);

   // const handleAddFavorite = (id: string) => {
   //    setFavorite((prev) => [...prev, id]);
   // };
   const item = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!autoScroll) return;

      // const node = item.current as HTMLElement;
      // node.scrollIntoView({block:"nearest", behavior: "smooth"})

      console.log("scroll");
   }, [active]);

   const buttonClasses = "h-[35px] w-[35px] p-[8px] rounded-full";
   return (
      <div
         ref={item}
         onClick={onClick}
         className={`group/main flex flex-row rounded justify-between items-center p-[10px] hover:bg-${theme?.alpha} `}
      >
         <div className="flex flex-row">
            <div className="h-[54px] w-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0">
               <img className="" src={data.image_path} alt="" />

               {active && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                     <div className="relative h-[18px] w-[18px]">
                        <img
                           src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                           alt=""
                        />
                     </div>
                  </div>
               )}
               {!active && (
                  <div
                     className="absolute  inset-0 bg-black bg-opacity-60 
             items-center justify-center hidden max-[549px]:hidden group-hover/image:flex"
                  >
                     <Button
                        onClick={onClick}
                        variant={"default"}
                        className="h-[25px] w-[25px] text-white"
                     >
                        <PauseCircleIcon />
                     </Button>
                  </div>
               )}
            </div>
            <div className="ml-[10px]">
               <h5 className="text-mg line-clamp-1">{data.name}</h5>
               <p className="text-xs text-gray-500 line-clamp-1">
                  {data.singer}
               </p>
            </div>
         </div>

         {/* cta */}
         <div className="flex flex-row gap-x-[5px]">
            <Button
               // onClick={() => handleAddFavorite(data.path)}
               className={`${buttonClasses} ${theme.content_hover_bg} ${
                  theme.type === "light"
                     ? "hover:text-[#33]"
                     : "hover:text-white"
               }`}
            >
               <HeartIcon />
            </Button>
            <div className="w-[40px] flex justify-center items-center">
               <Button
                  className={`hidden group-hover/main:block ${buttonClasses} 
                  ${theme.content_hover_bg}
                  ${
                     theme.type === "light"
                        ? "hover:text-[#33]"
                        : "hover:text-white"
                  }`}
               >
                  <Bars3Icon />
               </Button>
               <span className="pr-[8px] text-xs group-hover/main:hidden">
                  {handleTimeText(data.duration)}
               </span>
            </div>
         </div>
      </div>
   );
}

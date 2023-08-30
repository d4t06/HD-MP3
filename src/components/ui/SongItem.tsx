import { FC } from "react";
import { Song, ThemeKeyType, ThemeType } from "../../types";
import {
   VariantProps,
   cva,
} from "class-variance-authority";
import { useTheme } from "../../store/ThemeContext";
import Button from "./Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";

const SongItemVariant = cva("", {
   variants: {
      size: {
         default: "w-[5rem] h-[5rem]",
         small: "w-[2.5rem] h-[2.5rem]",
      },
      style: {
         default: "rounded",
         circle: "rounded-full",
      },
   },
   defaultVariants: {
      size: "default",
      style: "default",
   },
});

interface Props
   extends VariantProps<typeof SongItemVariant> {
   song: Song;
   onClick?: () => void;
   active?: boolean;
   theme: ThemeType & {alpha : string};
}

const SongItem: FC<Props> = ({
   song,
   size,
   style,
   active,
   theme,
   onClick,
}) => {
   return (
      <div
         className={`flex flex-row border border-transparent rounded-[8px] hover:bg-${theme.alpha} p-[10px] cursor-pointer relative 
            `}
         onClick={onClick}
      >
         <div className={SongItemVariant({ size, style }) + " group relative rounded-[4px] overflow-hidden"}>
            <img
               className={`w-full object-cover object-center`}
               src={
                  song?.image_path ||
                  "https://placehold.co/200x200"
               }
            />

            <div
               className="absolute  inset-0 bg-black bg-opacity-60 
             items-center justify-center hidden max-[549px]:hidden group-hover:flex"
            >
               <Button
                  onClick={onClick}
                  variant={"default"}
                  className="h-[30px] w-[30px] text-white"
               >
                  <PauseCircleIcon />
               </Button>
            </div>
         </div>
         <div className="ml-5">
            <h5 className="text-md font-medium overflow-hidden">
               {song?.name || "name"}
            </h5>
            <p className="text-sm text-gray-500">
               {song?.singer || "singer"}
            </p>
         </div>
         {/* {active && (
            <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[20px] h-[20px]">
               <img
                  className=""
                  src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                  alt=""
               />
            </div>
         )} */}
      </div>
   );
};

export default SongItem;

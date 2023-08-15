import { FC } from "react";
import { Song } from "../../types";
import { VariantProps, cva } from "class-variance-authority";

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

interface Props extends VariantProps<typeof SongItemVariant> {
   song?: Song;
   onClick?: () => void;
   active?: boolean;
}

const SongItem: FC<Props> = ({ song, size, style, active, onClick }) => {
   return (
      <div
         className={`p-3 flex flex-row hover:bg-indigo-950 border border-transparent rounded cursor-pointer relative ${
            active ? "bg-indigo-950" : ""
         }`}
         onClick={onClick}
      >
         <div className={SongItemVariant({ size, style })}>
            <img
               className={`w-full object-cover object-center rounded`}
               src={song?.image || "https://placehold.co/200x200"}
            />
         </div>
         <div className="text-gray-100 ml-5">
            <h5 className="text-lg mb overflow-hidden">{song?.name || "name"}</h5>
            <p className="text-md opacity-80">{song?.singer || "singer"}</p>
         </div>
         {active && (
            <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[20px] h-[20px]">
               <img
                  className=""
                  src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                  alt=""
               />
            </div>
         )}
      </div>
   );
};

export default SongItem;

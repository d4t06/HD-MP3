import { Image } from ".";
import { Song } from "../types";

interface Props {
   data?: Song;
   active: boolean;
   classNames?: string;
}

export default function MobileSongThumbnail({ data, active }: Props) {
   const classes = {
      container: "flex flex-col",
      imageFrame: "rounded-[4px] overflow-hidden",
      image: "select-none object-cover object-center w-full",
   };

   if (!data) return;

   return (
      <div
         className={`${classes.container} ${
            active ? "w-full px-[20px]" : "w-[60px] h-[60px] flex-shrink-0"
         }`}
      >
         <div className={`${classes.imageFrame}`}>
            {/* <img
               src={data.image_url || "https://placehold.co/100"}
               className="w-full"
               alt=""
            /> */}
            <Image src={data.image_url} classNames="w-full"/>
         </div>
      </div>
   );
}

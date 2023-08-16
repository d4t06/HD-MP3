import { FC, useEffect, useRef } from "react";
import { Song } from "../../types";
import Button from "./Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";

interface Props {
   data: Song;
   active: boolean;
   onClick?: () => void;
   containerEle?: HTMLElement;
}

const SongThumbnail: FC<Props> = ({ data, active, onClick, containerEle }) => {
   const thumbnail = useRef<HTMLDivElement>(null);
   const node = thumbnail.current as HTMLElement;

   useEffect(() => {
      if (containerEle && active) {
         const windowWidth = window.innerWidth;

         const rect = node.getBoundingClientRect();

         const lefDiff = rect.left;
         const rightDiff = windowWidth - (lefDiff + node.offsetWidth);

         const needToScroll = Math.abs(lefDiff - rightDiff) / 2;

         // console.log("need to scroll, node", needToScroll, node);


         // if element not in screen
         if (Math.abs(lefDiff) > windowWidth ||
            Math.abs(rightDiff) > windowWidth) {

            containerEle.style.scrollBehavior = 'auto';
         }

         // on the left side
         if (rightDiff > lefDiff) {

            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft - needToScroll;
               containerEle.style.scrollBehavior = 'smooth';

            }, 300);

            // on the right side
         } else if (rightDiff < lefDiff) {
            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft + needToScroll;
               containerEle.style.scrollBehavior = 'smooth';

            }, 300);
         }
      }
   }, [active]);

   return (
      <div ref={thumbnail} className={`flex flex-col `}>
         <div
            className={`h-[350px] w-[350px] flex justify-center`}
         >
            <div className={`group relative ${active ? "w-[350px]" : "w-[250px]"
               } transition-[width] duration-300 origin-top self-end`}>
               <img
                  className={`select-none object-cover object-center`}
                  src={data.image}
                  alt=""
               />
               <div
                  className="absolute inset-0 bg-black bg-opacity-60 
             items-center justify-center group-hover:flex hidden"
               >
                  <Button
                     onClick={onClick}
                     variant={"circle"}
                     className="h-[50px] w-[50px] text-white"
                  >
                     <PauseCircleIcon />
                  </Button>
               </div>

               {active && (
                  <div className="absolute h-[30px] w-[30px] bottom-[15px] left-[15px]">
                     <img
                        src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                        alt=""
                     />
                  </div>
               )}
            </div>


         </div>
         <div className={``}>
            <h2 className="text-3xl text-center font-bold mt-[14px]">{data.name}</h2>
            <p className="text-center text-lg mt-[7px] text-gray-500">{data.singer}</p>
         </div>
      </div>
   );
};

export default (SongThumbnail);


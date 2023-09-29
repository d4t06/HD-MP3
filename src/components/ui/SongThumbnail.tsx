import { FC, RefObject, useEffect, useRef } from "react";
import { Song } from "../../types";
import Button from "./Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";
import useScrollSong from "../../hooks/useScrollSong";

interface Props {
   data?: Song;
   active: boolean;
   onClick?: () => void;
   containerRef?: RefObject<HTMLDivElement>;
   hasHover?: boolean;
   hasTitle?: boolean;
   classNames?: string;
   scroll: boolean
}

const SongThumbnail: FC<Props> = ({
   data,
   active,
   hasHover,
   onClick,
   containerRef,
   hasTitle,
   classNames,
   scroll
}) => {
   const thumbnail = useRef<HTMLDivElement>(null);
   const firstTimeRender = useRef(true);

   // use hooks
   useScrollSong({active, containerRef, songItemRef: thumbnail, scroll, firstTimeRender})

   useEffect(() => {
      console.log('check first time render', firstTimeRender.current);

   }, [])

   // useEffect(() => {
   //    if (!data) return;
   //    if (containerEle && active) {
   //       const windowWidth = window.innerWidth;

   //       if (!node) return;
         
   //       const rect = node.getBoundingClientRect();

   //       const lefDiff = rect.left;
   //       const rightDiff = windowWidth - (lefDiff + node.offsetWidth);

   //       const needToScroll = Math.abs(lefDiff - rightDiff) / 2;

   //       // console.log('song thumbnail check scroll, left ', lefDiff, 'right ', rightDiff )

   //       // if element not in screen
   //       if (Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
   //          containerEle.style.scrollBehavior = "auto";
   //       }

   //       // on the left side
   //       if (rightDiff > lefDiff) {
   //          setTimeout(() => {
   //             containerEle.scrollLeft = containerEle.scrollLeft - needToScroll;
   //             containerEle.style.scrollBehavior = "smooth";
   //          }, 300);

   //          // on the right side
   //       } else if (rightDiff < lefDiff) {
   //          setTimeout(() => {
   //             containerEle.scrollLeft = containerEle.scrollLeft + needToScroll;
   //             containerEle.style.scrollBehavior = "smooth";
   //          }, 300);
   //       }
   //    }
   // }, [active]);

   return (
      <>
         {data && (
            <div ref={thumbnail} className={`flex flex-col delay-3000 ${active && 'transition-transform '}`}>
               <div className={` flex ${classNames && classNames}`}>
                  <div
                     className={`group relative ${
                        active
                           ? "w-[350px] max-[549px]:w-[100%]"
                           : "w-[250px] max-[549px]:w-[75%]"
                     } transition-[width] duration-300 origin-center`}
                  >
                     <img
                        className={`select-none object-cover object-center rounded w-full`}
                        src={data?.image_url || "https://placehold.co/500x500.png"}
                        alt=""
                     />

                     {hasHover && (
                        <div
                           className="absolute inset-0 bg-black bg-opacity-60 
             items-center justify-center hidden max-[549px]:hidden group-hover:flex"
                        >
                           <Button
                              onClick={onClick}
                              variant={"circle"}
                              className="h-[50px] w-[50px] text-white"
                           >
                              <PauseCircleIcon />
                           </Button>
                        </div>
                     )}

                     {active && window.innerWidth >= 550 && (
                        <div className="absolute h-[30px] w-[30px] bottom-[15px] left-[15px]">
                           <img
                              src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                              alt=""
                           />
                        </div>
                     )}
                  </div>
               </div>

               {hasTitle && (
                  <div>
                     <h2
                        className={`text-2xl text-white  text-center mt-[10px] font-bold  max-[549px]:text-xl text-ellipsis line-clamp-1 ${
                           active ? "" : ""
                        }`}
                     >
                        {data?.name || "Some song"}
                     </h2>
                     <p className="text-center text-md  text-gray-500">
                        {data?.singer || "..."}
                     </p>
                  </div>
               )}
            </div>
         )}
      </>
   );
};

export default SongThumbnail;

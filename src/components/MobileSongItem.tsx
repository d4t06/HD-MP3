import { Dispatch, MouseEvent, SetStateAction, useCallback } from "react";
import { Song, ThemeType } from "../types";
import { CheckIcon, PauseCircleIcon, StopIcon } from "@heroicons/react/24/outline";
import Image from "./ui/Image";

type Props = {
   data: Song;
   theme: ThemeType & { alpha: string };
   active: boolean;
   onClick: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;

   isCheckedSong?: boolean;
   selectedSongList?: Song[];

   setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;
   setIsCheckedSong?: Dispatch<SetStateAction<boolean>>;
};

const MobileSongItem = ({
   data,
   theme,
   selectedSongList,
   active,
   onClick,

   isCheckedSong,
   setSelectedSongList,
   setIsCheckedSong,
}: Props) => {
   const isSelected = useCallback(() => {
      if (!selectedSongList) return false;
      return selectedSongList?.indexOf(data) != -1;
   }, [selectedSongList]);

   const handleSelect = (song: Song) => {
      console.log("check selected");
      if (!setSelectedSongList || !selectedSongList) {
         console.log("song list item lack of props");
         return;
      }

      if (!isCheckedSong) {
         setIsCheckedSong && setIsCheckedSong(true);
      }

      let list = [...selectedSongList];
      const index = list.indexOf(song);

      // if no present
      if (index === -1) {
         list.push(song);

         // if present
      } else {
         list.splice(index, 1);
      }
      setSelectedSongList(list);
      if (!list.length) {
         setIsCheckedSong && setIsCheckedSong(true);
      }
   };

   const classes = {
      button: `${theme.content_bg} rounded-full`,
      textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
      songListButton: `mr-[10px] px-[5px] text-${theme.alpha} group-hover/main:text-[inherit]`,
      itemContainer: `item-container transition-all  origin-top duration-[300ms] border-b border-${
         theme.alpha
      } flex flex-row rounded-[4px] justify-between w-[100%] px-[5px] py-[10px] ${
         isSelected() && "bg-" + theme.alpha
      }`,
      imageFrame: `w-[54px] h-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0`,
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
   };

   return (
      <>
         <div className={`${classes.itemContainer}`}>
            <div className={`flex flex-row w-[100%]`}>
               <>
                  {/* check box */}
                  {!isCheckedSong ? (
                     <>
                        <button
                           onClick={() => handleSelect(data)}
                           className={`${classes.songListButton} block`}
                        >
                           <StopIcon className="w-[18px] " />
                        </button>
                     </>
                  ) : (
                     <button
                        onClick={() => handleSelect(data)}
                        className={`${classes.songListButton} text-[inherit]`}
                     >
                        {!isSelected() ? (
                           <StopIcon className="w-[18px]" />
                        ) : (
                           <CheckIcon className="w-[18px]" />
                        )}
                     </button>
                  )}
               </>

               {/* song image */}
               <div className="flex-grow flex" onClick={e => onClick(e)}>
                  <div className={`${classes.imageFrame}`}>
                     <Image blurHashEncode={data.blurhash_encode} src={data.image_url} />

                     {/* hidden when in process and in list */}
                     {active && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex songContainers-center items-center justify-center">
                           <PauseCircleIcon className="w-[28px] text-[#fff]" />
                        </div>
                     )}
                  </div>

                  {/* song info */}
                  <div className="ml-[10px]">
                     <h5 className={`text-mg line-clamp-1 ${active && theme.content_text}`}>
                        {data.name}
                     </h5>
                     <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}


export default MobileSongItem
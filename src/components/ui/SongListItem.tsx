import { FC } from "react";
import { Song } from "../../types";
import Button from "./Button";
import { Bars3Icon, HeartIcon } from "@heroicons/react/24/outline";
import useLocalStorage from "../../hooks/useLocalStorage";

interface Props {
   data: Song;
   active?: boolean;
   onClick: () => void;
}

const SongListItem: FC<Props> = ({ data, active, onClick }) => {
   const [favorite, setFavorite] = useLocalStorage("favorites", [""]);

   const handleAddFavorite = (id: string) => {
      setFavorite((prev) => [...prev, id]);
   };

   return (
      <div
         onClick={onClick}
         className={`group flex flex-row rounded justify-between items-center p-[10px] hover:bg-indigo-950  ${
            active ? "bg-indigo-950" : ""
         }`}
      >
         <div className="flex flex-row">
            <div className="h-[44px] w-[44px] relative">
               <img className="rounded" src={data.image} alt="" />

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
            </div>
            <div className="ml-[10px]">
               <h5 className="text-lg">{data.name}</h5>
               <p className="text-md text-gray-500">{data.singer}</p>
            </div>
         </div>

         {/* cta */}
         <div className="flex flex-row gap-x-[10px]">
            <Button
               onClick={() => handleAddFavorite(data.path)}
               className="h-[35px] w-[35px] p-[8px] rounded-full hover:bg-indigo-950 text-gray-500"
            >
               <HeartIcon />
            </Button>
            <Button className="h-[35px] w-[35px] p-[8px] rounded-full hover:bg-indigo-950 text-gray-500">
               <Bars3Icon />
               <span className="group-hover:hidden">00:00</span>
            </Button>
         </div>
      </div>
   );
};

export default SongListItem;

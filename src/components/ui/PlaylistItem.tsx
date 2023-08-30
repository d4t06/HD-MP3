import { FC } from "react";
import Button from "./Button";
import { Bars3Icon, PauseCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Playlist } from "../../types";

interface Props {data: Playlist, theme?: string}

const PlaylistItem: FC<Props> = ({data, theme}) => {

  
   return (
      <div className="group">
         <div className="relative overflow-hidden rounded-xl">
            <img
               className="transition group-hover:scale-105"
               src="https://e-cdns-images.dzcdn.net/images/cover/f0a1d4442389bcd7919a7054f8c0b785/500x500-000000-80-0-0.jpg"
               alt=""
            />

            <div className="absolute hidden inset-0 group-hover:block">
               <div className="absolute inset-0 bg-black opacity-60"></div>
               <div className="flex flex-row justify-center items-center h-full gap-4 relative z-10">
                  <Button className="rounded-full p-1 hover:bg-indigo-600">
                     <XMarkIcon className="h-10 w-10" />
                  </Button>
                  <Button>
                     <PauseCircleIcon className="h-20 w-20" />
                  </Button>
                  <Button className="rounded-full p-1 hover:bg-indigo-600 ">
                     <Bars3Icon className="h-10 w-10 text-white" />
                  </Button>
               </div>
            </div>
         </div>
         <h5 className="text-xl mt-2">{data.name}</h5>
      </div>
   );
};

export default PlaylistItem;

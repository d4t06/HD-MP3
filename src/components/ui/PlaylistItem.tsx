import { FC } from "react";
import Button from "./Button";
import { Bars3Icon, PauseCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Playlist, Song, ThemeType } from "../../types";
import { Link } from "react-router-dom";
import { routes } from "../../routes";

interface Props {
   data: Playlist;
   theme: ThemeType & { alpha: string };
   song?: Song;
   inDetail?: boolean;
   onClick?: () => void
}

const PlaylistItem: FC<Props> = ({ data, inDetail, song, theme , onClick}) => {
   const classes = {
      button: `rounded-full p-[4px] hover:bg-${theme.alpha}`,
   };
   
   return (
      <div className="group">
         <div className="relative overflow-hidden rounded-xl">
            <img
               className="transition group-hover:scale-105"
               src={
                  song?.image_path ||
                  "https://placehold.co/400x400"
               }
               alt=""
            />

            <div className="absolute hidden inset-0 group-hover:block">
               <div className="absolute inset-0 bg-black opacity-60"></div>
               <div className="flex flex-row justify-center items-center h-full gap-4 relative z-10">
                  {!inDetail && <Button className={classes.button}>
                     <XMarkIcon className="w-[20px]" />
                  </Button>}
                  {!inDetail ? (
                     <Link to={`${routes.playlist}/${data.name}`}>
                        <Button className={classes.button}>
                           <PauseCircleIcon className="w-[35px]" />
                        </Button>
                     </Link>
                  ) : (
                     <Button onClick={() => onClick && onClick()} className={classes.button}>
                        <PauseCircleIcon className="w-[35px]" />
                     </Button>
                  )}

                  {!inDetail && <Button className={classes.button}>
                     <Bars3Icon className="w-[20px] text-white" />
                  </Button>}
               </div>
            </div>
         </div>
         {!inDetail && <h5 className="text-[20px] mt-[5px]">{data.name}</h5>}
      </div>
   );
};

export default PlaylistItem;

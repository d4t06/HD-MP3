import { PauseCircleIcon } from "@heroicons/react/24/outline";
import { FC, useMemo } from "react";

import { Playlist, ThemeType } from "../types";

import Button from "./ui/Button";
import { routes } from "../routes";
import { Link } from "react-router-dom";
import Image from "./ui/Image";

interface Props {
   data: Playlist;
   theme?: ThemeType & { alpha: string };
   inDetail?: boolean;
   onClick?: () => void;
}

const PlaylistItem: FC<Props> = ({ data, inDetail, theme, onClick }) => {
   const classes = {
      button: `rounded-full text-[#fff] p-[4px] hover:bg-${theme?.alpha}`,
      imageContainer: `relative overflow-hidden rounded-xl flex-grow`,
      absoluteContainer: "absolute hidden inset-0 group-hover:block",
      overlay: "absolute inset-0 bg-[#333] opacity-60",
      buttonContainer: "justify-center items-center h-full relative z-10 relative",
      buttonWrapper: "flex items-center justify-center z-10 h-full w-full relative",
   };
   const isOnMobile = useMemo(() => {
      return window.innerWidth < 550;
   }, []);

   return (
      <>
         <div
            className="group h-full flex flex-col"
            onClick={() => isOnMobile && onClick && onClick()}
         >
            <div className={classes.imageContainer}>
               <Image classNames="h-full w-full aspect-square object-cover object-center" src={data.image_url} />

               {!isOnMobile && !inDetail && (
                  <div className={classes.absoluteContainer}>
                     <div className={classes.overlay}></div>

                     <div className={classes.buttonWrapper}>
                        <Link to={`${routes.Playlist}/${data.id}`}>
                           <Button onClick={() => onClick && onClick()} className={classes.button}>
                              <PauseCircleIcon className="w-[35px]" />
                           </Button>
                        </Link>
                     </div>
                  </div>
               )}
            </div>
            {!inDetail && <h5 className="text-[20px] font-[500]">{data.name}</h5>}
         </div>
      </>
   );
};

export default PlaylistItem;
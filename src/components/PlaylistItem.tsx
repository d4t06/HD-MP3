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
      imageContainer: `absolute inset-0 overflow-hidden rounded-[6px]`,
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
            className="group relative pt-[100%]"
            onClick={() => isOnMobile && onClick && onClick()}
         >
            <div className={classes.imageContainer}>
               <Image classNames="" src={data.image_url} blurHashEncode={data.blurhash_encode} />

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
         </div>
         {!inDetail && <h5 className="text-[20px] font-[500]">{data.name}</h5>}
      </>
   );
};

export default PlaylistItem;

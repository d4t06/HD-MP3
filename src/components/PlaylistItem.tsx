import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";

interface Props {
   data: Playlist;
   theme?: ThemeType & { alpha: string };
   inDetail?: boolean;
   active?: boolean;
   onClick?: () => void;
   link?: string;
}

const PlaylistItem: FC<Props> = ({ data, inDetail, theme, active, link }) => {
   const classes = {
      button: `rounded-full text-[#201f1f] p-[4px] hover:bg-${theme?.alpha}`,
      imageContainer: `absolute inset-0 overflow-hidden rounded-[6px]`,
      absoluteContainer: "absolute inset-0 group-hover:block",
      overlay: "absolute inset-0 bg-[#000] opacity-[.5]",
      buttonContainer: "justify-center items-center h-full z-10 relative",
      buttonWrapper: "flex items-center justify-center z-10 h-full w-full relative",
   };

   const content = (
      <div className={classes.imageContainer}>
         <Image
            classNames="group-hover:scale-[1.1] transition duration-[.3s]"
            src={data.image_url}
            blurHashEncode={data.blurhash_encode}
         />

         <div className={`${classes.absoluteContainer} ${active ? "block" : "hidden"}`}>
            <div className={classes.overlay}></div>

            {active && (
               <div className={classes.buttonWrapper}>
                  <img src={playingIcon} alt="" className="w-[30px]" />
               </div>
            )}
         </div>
      </div>
   );

   if (inDetail)
      return <div className="group relative pt-[100%] w-full block">{content}</div>;

   return (
      <>
         <Link
            to={`${link || "/playlist/" + data.id}`}
            className="group relative pt-[100%] w-full block"
         >
            {content}
         </Link>

         <h5 className="text-[18px] line-clamp-1 leading-[22px] font-[500] mt-[6px]">
            {data.name}
         </h5>
      </>
   );
};

export default PlaylistItem;

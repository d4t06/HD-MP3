import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";

interface Props {
  data: Playlist;
  inDetail?: boolean;
  active?: boolean;
  onClick?: () => void;
  link?: string;
}

const PlaylistItem: FC<Props> = ({ data, inDetail, active, link }) => {
  const classes = {
    imageContainer: `absolute inset-0 rounded-lg overflow-hidden ${
      active && "flex items-center justify-center"
    } `,
  };

  const content = (
    <div className="pt-[100%] relative">
      {
        <div className={classes.imageContainer}>
          <Image
            className={`hover:scale-[1.05] transition-transform duration-300 object-center object-cover ${
              active ? "brightness-[90%]" : ""
            }`}
            src={data.image_url}
            blurHashEncode={data.blurhash_encode}
          />

          {active && <img src={playingIcon} alt="" className=" absolute w-[30px]" />}
        </div>
      }
    </div>
  );

  if (inDetail) return content;

  return (
    <>
      <Link to={`${link || "/playlist/" + data.id}`} className="">
        {content}
      </Link>

      <p className="text-lg font-[500] leading-[1.2] line-clamp-1 mt-1.5">{data.name}</p>
      <p className="text-sm opacity-[.7] leading-[1.2] line-clamp-1">{data.distributor}</p>
    </>
  );
};

export default PlaylistItem;

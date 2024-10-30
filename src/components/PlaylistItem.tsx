import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";
import { Empty } from ".";
import { useTheme } from "@/store";

interface Props {
  data: Playlist;
  inDetail?: boolean;
  active?: boolean;
  onClick?: () => void;
  link?: string;
}

const PlaylistItem: FC<Props> = ({ data, inDetail, active, link }) => {
  const { theme } = useTheme();

  const classes = {
    button: `rounded-full text-[#201f1f] p-[4px] hover:bg-${theme?.alpha}`,
    imageContainer: `absolute inset-0 overflow-hidden flex items-center justify-center `,
  };

  const content = (
    <Empty  theme={theme}>
      {
        <div className={classes.imageContainer}>
          <Image className="hover:scale-[1.05] transition-transform duration-300 object-center object-cover" src={data.image_url} blurHashEncode={data.blurhash_encode} />

          {active && <img src={playingIcon} alt="" className=" absolute w-[30px]" />}
        </div>
      }
    </Empty>
  );

  if (inDetail) return content;

  return (
    <>
      <Link to={`${link || "/playlist/" + data.id}`} className="">{content}</Link>

      <div className="text-xl font-[500] line-clamp-1 leading-[24px]  mt-[6px]">
        {data.name}
      </div>
    </>
  );
};

export default PlaylistItem;

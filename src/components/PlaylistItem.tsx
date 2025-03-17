import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";
import { Center, Square } from ".";

interface Props {
  data: Playlist;
  inDetail?: boolean;
  active?: boolean;
  onClick?: () => void;
  link?: string;
}

const PlaylistItem: FC<Props> = ({ data, inDetail, active, link }) => {
  const content = (
    <Square>
      <Image
        className={`hover:scale-[1.05] transition-transform object-cover ${
          active ? "brightness-[90%]" : ""
        }`}
        src={data.image_url}
        blurHashEncode={data.blurhash_encode}
      />

      {active && (
        <Center>
          <img src={playingIcon} alt="" className="w-[30px]" />
        </Center>
      )}
    </Square>
  );

  if (inDetail) return content;

  return (
    <>
      <Link to={`${link || "/playlist/" + data.id}`} className="">
        {content}
      </Link>

      <p className="text-lg font-[500] leading-[1.2] line-clamp-1 mt-1.5">{data.name}</p>
      <p className="text-sm opacity-[.7] leading-[1.2] line-clamp-1">
        {data.distributor}
      </p>
    </>
  );
};

export default PlaylistItem;

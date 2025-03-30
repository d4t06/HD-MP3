import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";
import { Center, Square } from ".";

interface Props {
  data: Playlist;
  variant?: "link" | "image";
  active?: boolean;
  onClick?: () => void;
  link?: string;
}

const PlaylistItem: FC<Props> = ({ data, variant = "link", active, link }) => {
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

  const renderItem = () => {
    switch (variant) {
      case "link":
        return (
          <>
            <Link to={`${link || "/playlist/" + data.id}`} className="">
              {content}
            </Link>

            <p className="text-lg font-[500] leading-[1.3] line-clamp-1 mt-1.5">
              {data.name}
            </p>
            <p className="text-sm opacity-[.7] leading-[1.3] line-clamp-1">
              {data.is_album ? data.singers[0].name : data.distributor}
            </p>
          </>
        );
      case "image":
        return content;
    }
  };

  return renderItem();
};

export default PlaylistItem;

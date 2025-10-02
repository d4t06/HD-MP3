import { FC } from "react";

import { Link } from "react-router-dom";
import Image from "./ui/Image";
import playingIcon from "../assets/icon-playing.gif";
import { Center, Skeleton } from ".";
import RatioFrame from "./ui/RatioFrame";

type SkeProps = {
  variant: "skeleton";
};

type BaseProps = {
  data: Playlist;
  variant: "link" | "image";
  active?: boolean;
  link?: string;
  onClick?: () => void;
};

type Props = SkeProps | BaseProps;

const PlaylistItem: FC<Props> = (props) => {
  const imageContent = (props.variant === "image" ||
    props.variant === "link") && (
    <RatioFrame className="pt-[100%] rounded-lg overflow-hidden">
      <Image
        className={`hover:scale-[1.05] duration-[.3s] transition-transform object-cover ${
          props.active ? "brightness-[90%]" : ""
        }`}
        src={props.data.image_url}
        blurHashEncode={props.data.blurhash_encode}
      />

      {props.active && (
        <Center>
          <img src={playingIcon} alt="" className="w-[30px]" />
        </Center>
      )}
    </RatioFrame>
  );

  const renderItem = () => {
    switch (props.variant) {
      case "skeleton":
        return (
          <div className="p-3 w-1/2 sm:w-1/3 md:w-1/4">
            <Skeleton className="pt-[100%] rounded-lg" />
            <Skeleton className="h-[21px] mt-1.5 w-3/4" />
            <Skeleton className="h-[13px] mt-1 w-3/4" />
          </div>
        );
      case "link":
        return (
          <div className="p-3 w-1/2 sm:w-1/3 md:w-1/4 font-bold">
            <Link
              onClick={() => props.onClick && props.onClick()}
              to={`${props.link || "/playlist/" + props.data.id}`}
            >
              {imageContent}
            </Link>

            <p className="text-sm line-clamp-1 mt-1.5">
              {props.data.name}
            </p>
            <p className="text-xs item-info line-clamp-1">
              {props.data.is_album
                ? props.data.singers[0].name
                : props.data.distributor}
            </p>
          </div>
        );
      case "image":
        return imageContent;
    }
  };

  return renderItem();
};

export default PlaylistItem;

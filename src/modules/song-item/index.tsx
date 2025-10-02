import { MouseEventHandler, useMemo } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "@/assets/icon-playing.gif";
import SongMenu from "@/modules/song-menu";
import { useThemeContext } from "@/stores";
import { getHidden } from "@/utils/appHelpers";
import { Image, SingerLinkList } from "@/components";
import HearBtn from "./_components/HearBtn";
import SongRankDiff from "./_components/SongRankDiff";
import { CheckBox } from "./_components/CheckBox";
import RankNumber from "./_components/RankNumber";

type Props = {
  className?: string;
  active?: boolean;
  onClick: () => void;
  song: Song;
  index: number;
  isLiked: boolean | null; // null if user is null
  isHasCheckBox: boolean;
  imageUrl?: string;
  attributes?: (s: Song) => Record<string, string>;
  variant:
    | "system-song"
    | "own-song"
    | "queue-song"
    | "recent-song"
    | "own-playlist"
    | "trending"
    | "table";
};

export type SongItemModal = "edit" | "delete" | "add-to-playlist";

function SongItem({
  song,
  onClick,
  isHasCheckBox,
  active = true,
  isLiked,
  index,
  className = "",
  imageUrl,
  ...props
}: Props) {
  // stores
  const { isOnMobile } = useThemeContext();

  // define style
  const classes = {
    itemContainer: `song-item sm:group/container`,
    imageFrame: ` relative rounded overflow-hidden flex-shrink-0`,
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
  };

  const imageOverlay = useMemo(() => {
    switch (props.variant) {
      default:
        return (
          <div
            className={` ${classes.overlay} 
               ${!active ? "hidden sm:group-hover/main:flex" : ""}`}
          >
            <img
              src={playingIcon}
              alt=""
              className={`"h-[18px] w-[18px] ${getHidden(!active)}`}
            />
            <button
              type="button"
              onClick={onClick}
              className={` ${getHidden(active)} `}
            >
              <PlayIcon className=" w-[24px] text-white" />
            </button>
          </div>
        );
    }
  }, [active, onClick]);

  const getSongNameSize = () => {
    switch (props.variant) {
      case "queue-song":
      case "recent-song":
        return "text-xs";
      default:
        return "text-sm";
    }
  };

  const getSongImageSize = () => {
    switch (props.variant) {
      case "queue-song":
      case "recent-song":
        return "w-10 h-10";
      default:
        return "h-[54px] w-[54px]";
    }
  };

  const getSongSingerSize = () => {
    switch (props.variant) {
      case "queue-song":
      case "recent-song":
        return "text-xs";
      default:
        return "text-xs";
    }
  };

  const handleMobileClick: MouseEventHandler = (e) => {
    if (!isOnMobile) return;

    const node = e.target as HTMLElement;

    if (node.tagName === "A") return;

    onClick();
  };

  const leftContent = (
    <>
      {isHasCheckBox && <CheckBox song={song} />}

      <div className="flex-grow flex" onClick={handleMobileClick}>
        <div className={`${classes.imageFrame} ${getSongImageSize()}`}>
          <Image
            src={imageUrl || song.image_url}
            blurHashEncode={song.blurhash_encode}
          />
          {imageOverlay}
        </div>

        <div className={`ml-[10px] font-bold`}>
          <h5 className={`line-clamp-1 overflow-hidden ${getSongNameSize()}`}>
            {song.name}

            {import.meta.env.DEV && <span> ({props.variant})</span>}
          </h5>
          <div
            className={`${props.variant === "queue-song" && active ? "" : "item-info"} mt-0.5 line-clamp-1 ${getSongSingerSize()}`}
          >
            <SingerLinkList
              className={
                props.variant === "queue-song" && active
                  ? ""
                  : "hover:text-[--primary-cl]"
              }
              singers={song.singers}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderLeftContent = () => {
    switch (props.variant) {
      case "queue-song":
      case "recent-song":
        return leftContent;

      case "trending":
        return (
          <>
            <RankNumber className="mr-3" rank={index + 1} />
            {leftContent}
          </>
        );
      case "table":
        return (
          <>
            <RankNumber rank={index + 1} />
            <SongRankDiff song={song} />
            {leftContent}
          </>
        );
      default:
        return <div className="flex flex-grow items-center">{leftContent}</div>;
    }
  };

  const renderMenu = () => {
    switch (props.variant) {
      case "queue-song":
      case "recent-song":
        return <SongMenu variant={props.variant} song={song} index={index} />;

      default:
        return (
          <div className="flex justify-center md:w-[60px]">
            <SongMenu variant={props.variant} song={song} index={index} />
          </div>
        );
    }
  };

  const renderRightContent = (
    <div className="flex items-center">
      {isLiked != null && (
        <HearBtn
          className="p-2"
          isSongActive={active}
          songVariant={props.variant}
          isLiked={isLiked}
          song={song}
        />
      )}

      {renderMenu()}
    </div>
  );

  const renderContent = () => {
    switch (props.variant) {
      case "queue-song":
        return (
          <div
            className={`${classes.itemContainer} group/main ${
              active ? `bg-[--primary-cl] text-white active` : ``
            }`}
          >
            {renderLeftContent()}
            {renderRightContent}
          </div>
        );
      default:
        return (
          <div
            {...(props.attributes ? props.attributes(song) : {})}
            className={`${classes.itemContainer} ${className} group/main ${
              active ? `bg-[--a-5-cl] active` : ``
            }`}
          >
            {renderLeftContent()}
            {renderRightContent}
          </div>
        );
    }
  };

  return renderContent();
}

export default SongItem;

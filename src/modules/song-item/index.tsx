import { MouseEventHandler, useMemo } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "@/assets/icon-playing.gif";
import SongMenu from "@/modules/song-menu";
import { useThemeContext } from "@/stores";
import { getHidden } from "@/utils/appHelpers";
import { Image } from "@/components";
import HearBtn from "./_components/HearBtn";
import { Link } from "react-router-dom";
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

// type CheckBoxProps = {
//   onClick: () => void;
//   isChecked: boolean;
//   isSelected: boolean;
// };

// function CheckBox({ onClick, isChecked, isSelected }: CheckBoxProps) {
//   return (
//     <>
//       <button
//         onClick={onClick}
//         className={`mr-2 md:mr-3 selected ${isSelected ? "selected" : ""} group-hover/main:block ${isChecked ? "block" : "md:hidden "}`}
//       >
//         {!isSelected ? (
//           <StopIcon className="w-[18px]" />
//         ) : (
//           <CheckIcon className="w-[18px]" />
//         )}
//       </button>
//       <button
//         className={`mr-3 hidden group-hover/main:hidden group-hover/main:mr-[0px] md:block ${getClasses(
//           isChecked,
//           "md:hidden",
//         )}`}
//       >
//         <MusicalNoteIcon className="w-[18px]" />
//       </button>
//     </>
//   );
// }

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
  // const { isChecked, selectedSongs, selectSong } = useSongSelectContext();

  // const isSelected = useMemo(() => {
  //   if (!selectedSongs) return false;
  //   return selectedSongs.indexOf(song) != -1;
  // }, [selectedSongs]);

  // const handleSelect = () => {
  //   if (isChecked === undefined) return;
  //   selectSong(song);
  // };

  // define style
  const classes = {
    itemContainer: `w-full sm:group/container flex flex-row rounded-md justify-between py-2 px-3 last:border-none`,
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
        return "text-sm";
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

        <div className={`ml-[10px]`}>
          <h5
            className={`line-clamp-1 font-semibold overflow-hidden ${getSongNameSize()}`}
          >
            {song.name}

            {import.meta.env.DEV && (
              <span className="text-sm"> ({props.variant})</span>
            )}
          </h5>
          <div
            className={`${props.variant === "queue-song" && active ? "" : "item-info"} font-medium line-clamp-1 ${getSongSingerSize()}`}
          >
            {song.singers.map((s, i) =>
              s.id ? (
                <Link
                  to={`/singer/${s.id}`}
                  className={`${props.variant === "queue-song" ? "" : "hover:text-[--primary-cl]"} hover:underline`}
                  key={i}
                >
                  {(i ? ", " : "") + s.name}
                </Link>
              ) : (
                <span key={i}> {(i ? ", " : "") + s.name}</span>
              ),
            )}
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
              active ? `bg-[--primary-cl] text-white` : `hover:bg-[--a-5-cl]`
            }`}
          >
            {renderLeftContent()}
            {renderRightContent}
          </div>
        );
      default:
        return (
          <div
            className={`${classes.itemContainer} ${className} has-[:checked]:bg-[--a-5-cl] group/main ${
              active ? `bg-[--a-5-cl]` : `hover:bg-[--a-5-cl]`
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

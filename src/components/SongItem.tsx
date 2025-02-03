import { useMemo } from "react";

import { ArrowPathIcon, MusicalNoteIcon, StopIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { getHidden } from "../utils/appHelpers";

import { useTheme } from "../store";
import { Image } from "../components";

import SongMenu from "./SongMenu";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useSongSelectContext } from "@/store/SongSelectContext";

type Props = {
  className?: string;
  active?: boolean;
  onClick: () => void;
  song: Song;
  index: number;
  variant:
    | "home"
    | "my-songs"
    | "my-playlist"
    | "sys-playlist"
    | "queue"
    | "favorite"
    | "uploading"
    | "search-bar";
};

export type SongItemModal = "edit" | "delete" | "add-to-playlist";

function SongItem({ song, onClick, active = true, index, className, ...props }: Props) {
  // store
  const { theme, isOnMobile } = useTheme();
  const { isChecked, selectedSongs, selectSong } = useSongSelectContext();

  const isSelected = useMemo(() => {
    if (!selectedSongs) return false;
    return selectedSongs.indexOf(song) != -1;
  }, [selectedSongs]);

  const handleSelect = (song: Song) => {
    if (isChecked === undefined) return;
    selectSong(song);
  };

  // define style
  const classes = {
    button: `${theme.content_hover_bg} p-[8px] rounded-full`,
    checkboxButton: `mr-3 text-[inherit]`,
    itemContainer: `w-full sm:group/container cursor-pointer flex flex-row rounded justify-between p-[10px] border-b border-${theme.alpha} last:border-none`,
    imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
      props.variant === "queue" ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
    }`,
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
    ctaWrapper: "flex items-center justify-end flex-shrink-0",
    menuBtnWrapper: "w-[50px] flex justify-center relative",
  };

  const renderCheckBox = () => {
    switch (props.variant) {
      case "search-bar":
      case "queue":
      case "home":
        return <></>;
      case "uploading":
        return (
          <button className={`${classes.checkboxButton}`}>
            <MusicalNoteIcon className="w-[18px]" />
          </button>
        );
      default:
        if (isOnMobile)
          return (
            <button
              onClick={() => handleSelect(song)}
              className={`${classes.checkboxButton} text-[inherit]`}
            >
              {!isSelected ? (
                <StopIcon className="w-[18px]" />
              ) : (
                <CheckIcon className="w-[18px]" />
              )}
            </button>
          );
        return (
          <>
            <button
              onClick={() => handleSelect(song)}
              className={`${classes.checkboxButton} ${
                !isSelected && "hidden"
              } group-hover/main:block`}
            >
              {!isSelected ? (
                <StopIcon className="w-[18px]" />
              ) : (
                <CheckIcon className="w-[18px]" />
              )}
            </button>
            <button
              className={`${classes.checkboxButton} ${
                isSelected && "hidden"
              } group-hover/main:hidden group-hover/main:mr-[0px]`}
            >
              <MusicalNoteIcon className="w-[18px]" />
            </button>
          </>
        );
    }
  };

  const imageOverlay = useMemo(() => {
    switch (props.variant) {
      case "uploading":
        return <></>;
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
            <button onClick={onClick} className={`${getHidden(active)} `}>
              <PlayIcon className="w-[24px] text-white" />
            </button>
          </div>
        );
    }
  }, [active, onClick]);

  const getSongNameSize = () => {
    switch (props.variant) {
      case "queue":
        return "text-sm";
      default:
        return "";
    }
  };

  const getSongSingerSize = () => {
    switch (props.variant) {
      case "queue":
        return "text-xs";
      default:
        return "text-sm";
    }
  };

  const leftContent = (
    <>
      {renderCheckBox()}

      <div
        className="flex-grow flex"
        onClick={isOnMobile && props.variant !== "uploading" ? onClick : () => {}}
      >
        <div className={`${classes.imageFrame}`}>
          <Image src={song.image_url} blurHashEncode={song.blurhash_encode} />
          {imageOverlay}
        </div>

        <div className={`ml-[10px]`}>
          <h5 className={`line-clamp-1 font-medium overflow-hidden ${getSongNameSize()}`}>
            {song.name}
          </h5>
          <p className={`opacity-[.7] leading-[1.2] line-clamp-1 ${getSongSingerSize()}`}>
            {song.singer}
          </p>
        </div>
      </div>
    </>
  );

  const renderLeftContent = () => {
    switch (props.variant) {
      case "uploading":
        return (
          <div className="opacity-[.7] flex flex-grow overflow-hidden">{leftContent}</div>
        );
      case "queue":
        return leftContent;
      default:
        return <div className="flex flex-grow overflow-hidden">{leftContent}</div>;
    }
  };

  const renderMenu = () => {
    switch (props.variant) {
      case "search-bar":
      case "home":
        return <SongMenu index={index} variant="sys-song" song={song} />;
      case "my-songs":
        return <SongMenu variant="user-song" index={index} song={song} />;
      case "my-playlist":
        return <SongMenu variant="sys-song" index={index} song={song} />;
      case "sys-playlist":
        return <SongMenu variant="sys-song" song={song} index={index} />;
      case "queue":
        return <SongMenu variant="queue-song" song={song} index={index} />;
      default:
        return <></>;
    }
  };

  const renderRightContent = () => {
    switch (props.variant) {
      case "uploading":
        return (
          <div className="flex items-center">
            <span>
              <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
            </span>
            <p className="text-[14px]">In process...</p>
          </div>
        );

      default:
        return (
          <div className={classes.ctaWrapper}>
            <div className={classes.menuBtnWrapper}>{renderMenu()}</div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (props.variant) {
      case "uploading":
        return (
          <div className={`${classes.itemContainer} ${className || ""} `}>
            {renderLeftContent()}
            {renderRightContent()}
          </div>
        );
      case "queue":
        return (
          <div
            className={`${classes.itemContainer} group/main py-[6px] ${
              active ? `${theme.content_bg} text-white` : `hover:bg-${theme.alpha}`
            }`}
          >
            {renderLeftContent()}
            {renderRightContent()}
          </div>
        );
      default:
        return (
          <div
            className={`${classes.itemContainer} ${className || ""} group/main ${
              active || isSelected ? `bg-${theme.alpha}` : `hover:bg-${theme.alpha}`
            }`}
          >
            {renderLeftContent()}
            {renderRightContent()}
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
}

export default SongItem;

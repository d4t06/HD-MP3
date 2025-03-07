import { useMemo } from "react";

import { MusicalNoteIcon, StopIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import playingIcon from "../assets/icon-playing.gif";
import { getHidden } from "../utils/appHelpers";

import { useSongSelectContext, useThemeContext } from "../stores";
import { Image } from "../components";

import { CheckIcon } from "@heroicons/react/20/solid";
import SongMenu from "@/modules/song-menu";

type Props = {
  className?: string;
  active?: boolean;
  onClick: () => void;
  song: Song;
  index: number;
  isHasCheckBox: boolean;
  variant: "sys-song" | "user-song" | "queue-song" | "user-playlist";
};

export type SongItemModal = "edit" | "delete" | "add-to-playlist";

type CheckBoxProps = { onClick: () => void; isChecked: boolean; isSelected: boolean };

function CheckBox({ onClick, isChecked, isSelected }: CheckBoxProps) {
  const classes = {
    checkboxButton: `mr-3 `,
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`${classes.checkboxButton} ${
          !isSelected && "block md:hidden"
        }  group-hover/main:block`}
      >
        {!isSelected ? (
          <StopIcon className="w-[18px]" />
        ) : (
          <CheckIcon className="w-[18px]" />
        )}
      </button>
      <button
        className={`${
          classes.checkboxButton
        } hidden group-hover/main:hidden group-hover/main:mr-[0px] ${
          !isChecked && "md:block"
        }`}
      >
        <MusicalNoteIcon className="w-[18px]" />
      </button>
    </>
  );
}

function SongItem({
  song,
  onClick,
  isHasCheckBox,
  active = true,
  index,
  className,
  ...props
}: Props) {
  // stores
  const { theme, isOnMobile } = useThemeContext();
  const { isChecked, selectedSongs, selectSong } = useSongSelectContext();

  const isSelected = useMemo(() => {
    if (!selectedSongs) return false;
    return selectedSongs.indexOf(song) != -1;
  }, [selectedSongs]);

  const handleSelect = () => {
    if (isChecked === undefined) return;
    selectSong(song);
  };

  // define style
  const classes = {
    button: `${theme.content_hover_bg} p-[8px] rounded-full`,
    checkboxButton: `mr-3 text-[inherit]`,
    itemContainer: `w-full sm:group/container cursor-pointer flex flex-row rounded justify-between p-[10px] border-b border-${theme.alpha} last:border-none`,
    imageFrame: ` relative rounded-[4px] overflow-hidden flex-shrink-0 ${
      props.variant === "queue-song" ? "w-[40px] h-[40px]" : "h-[54px] w-[54px]"
    }`,
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
    ctaWrapper: "flex items-center justify-end flex-shrink-0",
    menuBtnWrapper: "w-[50px] flex justify-center relative",
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
            <button onClick={onClick} className={`${getHidden(active)} `}>
              <PlayIcon className="w-[24px] text-white" />
            </button>
          </div>
        );
    }
  }, [active, onClick]);

  const getSongNameSize = () => {
    switch (props.variant) {
      case "queue-song":
        return "text-sm";
      default:
        return "";
    }
  };

  const getSongSingerSize = () => {
    switch (props.variant) {
      case "queue-song":
        return "text-xs";
      default:
        return "text-sm";
    }
  };

  const leftContent = (
    <>
      {isHasCheckBox && (
        <CheckBox isChecked={isChecked} isSelected={isSelected} onClick={handleSelect} />
      )}

      <div className="flex-grow flex" onClick={isOnMobile ? onClick : () => {}}>
        <div className={`${classes.imageFrame}`}>
          <Image src={song.image_url} blurHashEncode={song.blurhash_encode} />
          {imageOverlay}
        </div>

        <div className={`ml-[10px]`}>
          <h5 className={`line-clamp-1 font-medium overflow-hidden ${getSongNameSize()}`}>
            {song.name}
          </h5>
          <div
            className={`opacity-[.7] leading-[1.2] line-clamp-1 ${getSongSingerSize()}`}
          >
            {song.singers.map((s, i) => (
              <p key={i}>{s.name}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderLeftContent = () => {
    switch (props.variant) {
      case "queue-song":
        return leftContent;
      default:
        return <div className="flex flex-grow overflow-hidden">{leftContent}</div>;
    }
  };

  const renderRightContent = (
    <div className={classes.ctaWrapper}>
      <div className={classes.menuBtnWrapper}>
        <SongMenu variant={props.variant} song={song} index={index} />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (props.variant) {
      case "queue-song":
        return (
          <div
            className={`${classes.itemContainer} group/main py-[6px] ${
              active ? `${theme.content_bg} text-white` : `hover:bg-${theme.alpha}`
            }`}
          >
            {renderLeftContent()}
            {renderRightContent}
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
            {renderRightContent}
          </div>
        );
    }
  };

  return renderContent();
}

export default SongItem;

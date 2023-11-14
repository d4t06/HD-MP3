import { Dispatch, MouseEvent, SetStateAction, useCallback } from "react";
import { Song, ThemeType } from "../types";
import { CheckIcon, PauseCircleIcon, StopIcon } from "@heroicons/react/24/outline";
import Image from "./ui/Image";
import { selectSongs } from "../utils/appHelpers";

type Props = {
  data: Song;
  theme: ThemeType & { alpha: string };
  active: boolean;
  onClick: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;

  isChecked?: boolean;
  selectedSongs?: Song[];

  setSelectedSongs?: Dispatch<SetStateAction<Song[]>>;
  setIsChecked?: Dispatch<SetStateAction<boolean>>;
};

// alway in state ready for select
const MobileSongItem = ({
  data,
  theme,
  selectedSongs,
  active,
  onClick,

  isChecked,
  setSelectedSongs,
  setIsChecked,
}: Props) => {
  const isSelected = useCallback(() => {
    if (!selectedSongs) return false;
    return selectedSongs?.indexOf(data) != -1;
  }, [selectedSongs]);

  const handleSelect = (song: Song) => {
    if (!setSelectedSongs || !selectedSongs || !setIsChecked) {
      return;
    }
    if (isChecked === undefined) return;
    selectSongs(song, isChecked, setIsChecked, selectedSongs, setSelectedSongs);
  };

  const classes = {
    button: `${theme.content_bg} rounded-full`,
    songListButton: `mr-[10px] px-[5px]`,
    itemContainer: `hover:bg-${
      theme.alpha
    } item-container transition-opacity duration-[.3s] border-b last:border-none border-${
      theme.alpha
    } flex rounded-[4px] justify-between w-[100%] px-[5px] py-[10px] ${
      isSelected() && "bg-" + theme.alpha
    }`,
    imageFrame: `w-[54px] h-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0`,
    before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
  };

  return (
    <>
      <div className={`${classes.itemContainer}`}>
        <div className={`flex flex-row w-[100%]`}>
          {/* check box */}
          {!isChecked ? (
            <button
              onClick={() => handleSelect(data)}
              className={`${classes.songListButton} block`}
            >
              <StopIcon className="w-[18px] " />
            </button>
          ) : (
            <button
              onClick={() => handleSelect(data)}
              className={`${classes.songListButton} text-[inherit]`}
            >
              {!isSelected() ? (
                <StopIcon className="w-[18px]" />
              ) : (
                <CheckIcon className="w-[18px]" />
              )}
            </button>
          )}

          {/* song image */}
          <div
            className="flex-grow flex"
            onClick={(e) => (isChecked ? handleSelect(data) : onClick(e))}
          >
            <div className={`${classes.imageFrame}`}>
              <Image blurHashEncode={data.blurhash_encode} src={data.image_url} />

              {/* hidden when in process and in list */}
              {active && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex songContainers-center items-center justify-center">
                  <PauseCircleIcon className="w-[28px] text-[#fff]" />
                </div>
              )}
            </div>

            {/* song info */}
            <div className="ml-[10px]">
              <h5 className={`text-mg line-clamp-1 ${active && theme.content_text}`}>
                {data.name}
              </h5>
              <p className="text-xs opacity-60 bg-blend-lighten line-clamp-1">
                {data.singer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSongItem;

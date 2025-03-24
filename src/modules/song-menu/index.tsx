import { Bars3Icon } from "@heroicons/react/24/outline";
import { ComponentProps, ReactNode, useState } from "react";
import { formatTime } from "@/utils/appHelpers";

import { useThemeContext } from "@/stores";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "@/components/MyPopup";
import { Image, PopupWrapper } from "@/components";
import { MenuList } from "@/components/ui/MenuWrapper";
import MyTooltip from "@/components/MyTooltip";

import QueueSongMenu from "./_components/QueueSongMenu";
import OwnSongMenu from "./_components/OwnSongMenu";
import SystemSongMenu from "./_components/SystemSongMenu";
import OwnPlaylistMenu from "./_components/OwnPlaylistMenu";
import SongItem from "../song-item";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-3 bg-[#fff]/5 rounded-md flex`}>
        <div className="w-[50px] h-[50px] rounded overflow-hidden flex-shrink-0">
          <Image src={song.image_url} className="object-cover object-center w-full" />
        </div>

        <div className="ml-1 text-sm">
          <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
          <p className="opacity-70 line-clamp-1">
            {song.singers.map((s, i) => s.name + (!!i ? ", " : ""))}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SongMenuContent({ children, song }: { children: ReactNode; song: Song }) {
  const { theme } = useThemeContext();

  return (
    <MyPopupContent appendTo="portal" className="w-[240px]">
      <PopupWrapper className={`py-2`} p={"clear"} theme={theme}>
        <SongInfo song={song} />
        <MenuList>{children}</MenuList>

        <p className="text-xs text-center opacity-70 mt-3">By {song.distributor}</p>
      </PopupWrapper>
    </MyPopupContent>
  );
}

type Props = {
  song: Song;
  index: number;
  variant: ComponentProps<typeof SongItem>["variant"];
};

function SongMenu({ song, index, variant }: Props) {
  // stores
  const { theme } = useThemeContext();

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const renderMenu = () => {
    switch (variant) {
      case "queue-song":
        return <QueueSongMenu song={song} index={index} />;
      case "own-song":
        return <OwnSongMenu song={song} />;
      case "own-playlist":
        return <OwnPlaylistMenu song={song} />;
      case "system-song":
        return <SystemSongMenu song={song} />;
    }
  };

  const classes = {
    button: `hover:bg-${theme.alpha} p-2 rounded-full`,
  };

  const getTriggerClass = () => {
    if (isOpenPopup) return `${theme.content_bg}`;
    else return "block md:hidden";
  };

  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger setIsOpenParent={setIsOpenPopup}>
          <MyTooltip isWrapped content="Menu">
            <button
              type="button"
              className={`block group-hover/main:block ${
                classes.button
              } ${getTriggerClass()}`}
            >
              <Bars3Icon className="w-5" />
            </button>
          </MyTooltip>
        </MyPopupTrigger>

        {variant !== "queue-song" && (
          <span
            className={`text-sm font-[500] hidden p-2 group-hover/main:hidden ${
              isOpenPopup ? "hidden" : "md:block"
            }`}
          >
            {formatTime(song.duration)}
          </span>
        )}

        {renderMenu()}
      </MyPopup>
    </>
  );
}

export default SongMenu;

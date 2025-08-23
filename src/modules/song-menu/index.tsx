import { ComponentProps, ReactNode, useState } from "react";
import { formatTime } from "@/utils/appHelpers";

import {
  Image,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  PopupWrapper,
} from "@/components";

import QueueSongMenu from "./_components/QueueSongMenu";
import OwnSongMenu from "./_components/OwnSongMenu";
import SystemSongMenu from "./_components/SystemSongMenu";
import OwnPlaylistMenu from "./_components/OwnPlaylistMenu";
import SongItem from "../song-item";
import { threeDotsIcon } from "@/assets/icon";
import { choVoTri } from "@/constants/app";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-2 bg-white/10 rounded-md flex`}>
        <div className="w-[50px] h-[50px] rounded overflow-hidden flex-shrink-0">
          <Image
            fallback={choVoTri.image}
            src={song.image_url}
            blurHashEncode={song.blurhash_encode}
            className="object-cover object-center w-full"
          />
        </div>

        <div className="ml-2 text-sm">
          <h5 className="line-clamp-1 font-semibold">{song.name}</h5>
          <p className="item-info line-clamp-1">
            {song.singers.map((s, i) => s.name + (!!i ? ", " : ""))}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SongMenuContent({
  children,
  song,
}: {
  children: ReactNode;
  song: Song;
}) {
  return (
    <MyPopupContent className="w-[240px]">
      <PopupWrapper>
        <SongInfo song={song} />
        <VerticalMenu>{children}</VerticalMenu>

        {/* <p className="text-xs text-center opacity-70 mt-3">
          By {song.distributor}
        </p>*/}
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
  const [isOpenPopup, _setIsOpenPopup] = useState(false);

  const renderMenu = () => {
    switch (variant) {
      case "queue-song":
        return <QueueSongMenu song={song} index={index} />;
      case "own-song":
        return <OwnSongMenu song={song} />;
      case "own-playlist":
        return <OwnPlaylistMenu song={song} />;
      default:
        return <SystemSongMenu song={song} />;
    }
  };

  const renderSongDuration = () => {
    switch (variant) {
      case "queue-song":
      case "recent-song":
        return <></>;
      default:
        return (
          <span
            className={`text-sm font-[500] hidden p-2 group-hover/main:hidden ${
              isOpenPopup ? "hidden" : "md:block"
            }`}
          >
            {formatTime(song.duration)}
          </span>
        );
    }
  };

  const classes = {
    button: `hover:bg-[--a-5-cl] p-2 rounded-full`,
  };

  const getTriggerClass = () => {
    if (isOpenPopup) return `bg-[--primary-cl]`;
    else return "block md:hidden";
  };

  return (
    <>
      <MyPopup appendOnPortal>
        {/*setIsOpenParent={setIsOpenPopup}*/}
        <MyPopupTrigger>
          {/*<MyTooltip isWrapped content="Menu">*/}
          <button
            type="button"
            className={`block group-hover/main:block ${
              classes.button
            } ${getTriggerClass()}`}
          >
            <span className="w-5 block">{threeDotsIcon}</span>
          </button>
          {/*</MyTooltip>*/}
        </MyPopupTrigger>

        {renderSongDuration()}
        {renderMenu()}
      </MyPopup>
    </>
  );
}

export default SongMenu;

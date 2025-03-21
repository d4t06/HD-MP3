import { Image, PopupWrapper } from "@/components";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "@/components/MyPopup";
import { MenuList } from "@/components/ui/MenuWrapper";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

import { useThemeContext } from "@/stores";
import PlaylistSongMenu from "./_components/PlaylistSongMenu";
import SongMenu from "./_components/SongMenu";
import { Button } from "../../_components";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-3 bg-white/10 rounded-md flex`}>
        <div className="w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden">
          <Image className="object-cover h-full" src={song.image_url} />
        </div>

        <div className="ml-2 text-sm">
          <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
        </div>
      </div>
    </div>
  );
}

type SongsMenuProps = {
  song: Song;
  children: ReactNode;
};

export function DashboardSongMenuWrapper({ song, children }: SongsMenuProps) {
  const { theme } = useThemeContext();

  return (
    <>
      <MyPopupContent className="w-[260px]" appendTo="portal">
        <PopupWrapper p={"clear"} className="py-2" theme={theme}>
          <SongInfo song={song} />
          <MenuList className="hover:[&>*:not(div.absolute)]:bg-black/5">
            {children}
          </MenuList>

          <p className="text-sm text-center opacity-70 mt-3">
            Provided by {song.distributor}
          </p>
        </PopupWrapper>
      </MyPopupContent>
    </>
  );
}

type Props = {
  song: Song;
  variant: "songs" | "playlist";
};

export default function DashboardSongMenu({ song, variant }: Props) {
  const renderMenu = () => {
    switch (variant) {
      case "songs":
        return <SongMenu song={song} />;
      case "playlist":
        return <PlaylistSongMenu song={song} />;
    }
  };

  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger>
          <Button size={"clear"} color={"second"} className={`p-1`}>
            <Bars3Icon className="w-5" />
          </Button>
        </MyPopupTrigger>
        {renderMenu()}
      </MyPopup>
    </>
  );
}

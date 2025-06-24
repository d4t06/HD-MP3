import {
  Image,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  MenuWrapper,
} from "@/components";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

import PlaylistSongMenu from "./_components/PlaylistSongMenu";
import SongMenu from "./_components/SongMenu";
import { Button } from "../../_components";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-2 bg-white/10 rounded-md flex`}>
        <div className="w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden">
          <Image className="object-cover h-full" src={song.image_url} />
        </div>

        <div className="ml-2 text-sm">
          <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
          <h5 className="line-clamp-1 text-sm opacity-[.7]">
            {song.singers.map((s, i) => (i ? ", " : "") + s.name)}
          </h5>
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
  return (
    <>
      <MyPopupContent className="w-[260px]">
        <MenuWrapper>
          <SongInfo song={song} />
          <VerticalMenu>{children}</VerticalMenu>

          {/* <p className="text-sm text-center opacity-70 mt-3">
            Provided by {song.distributor}
          </p> */}
        </MenuWrapper>
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

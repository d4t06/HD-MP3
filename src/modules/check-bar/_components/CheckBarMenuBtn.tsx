import { Bars3Icon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import {
  MyPopupContent,
  MyPopup,
  MyPopupTrigger,
  VerticalMenu,
  MenuWrapper,
} from "@/components";
import SystemSongCheckMenu from "./SystemSongCheckMenu";

export function CheckBarMenuContent({ children }: { children: ReactNode }) {
  return (
    <MyPopupContent>
      <MenuWrapper>
        <VerticalMenu>{children}</VerticalMenu>
      </MenuWrapper>
    </MyPopupContent>
  );
}

type Props = {
  variant: "own-playlist" | "system-song" | "uploaded-song" | "favorite-song";
};
export default function CheckBarMenuBtn({ variant }: Props) {
  // stores

  const renderMenu = () => {
    switch (variant) {
      default:
        return <SystemSongCheckMenu />;
    }
  };

  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger>
          <button className="!p-1.5" type="button">
            <Bars3Icon className="w-5" />
          </button>
        </MyPopupTrigger>

        {renderMenu()}
      </MyPopup>
    </>
  );
}

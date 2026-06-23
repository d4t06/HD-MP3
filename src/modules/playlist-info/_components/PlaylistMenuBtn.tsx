import {
  Button,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  PopupWrapper,
} from "@/components";
import { ReactNode } from "react";
import OtherPlaylistMenu from "./OthersPlaylistMenu";
import OwnPlaylistMenu from "./OwnPlaylistMenu";
// import { threeDotsIcon } from "@/assets/icon";

export function PlaylistMenuPopupContent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MyPopupContent
      className="w-[160px]"
      position="right-bottom"
      origin="top left"
      // animationClassName="origin-top-left"
    >
      <PopupWrapper>
        <VerticalMenu>{children}</VerticalMenu>
      </PopupWrapper>
    </MyPopupContent>
  );
}

type Props = {
  variant: "my-playlist" | "others-playlist";
};

export default function PlaylistMenuBtn({ variant }: Props) {
  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger>
          <Button size={"clear"}>
            <img src="./icons/gear.png" className="w-6" alt=""/>
          </Button>
        </MyPopupTrigger>

        {variant === "others-playlist" ? (
          <OtherPlaylistMenu />
        ) : (
          <OwnPlaylistMenu />
        )}
      </MyPopup>
    </>
  );
}

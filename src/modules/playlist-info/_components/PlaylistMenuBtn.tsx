import {
  Button,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  PopupWrapper,
} from "@/components";
import { ReactNode } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import OtherPlaylistMenu from "./OthersPlaylistMenu";
import OwnPlaylistMenu from "./OwnPlaylistMenu";

export function PlaylistMenuPopupContent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MyPopupContent
      className="left-[calc(100%)] bottom-full w-[160px]"
      animationClassName="origin-top-left"
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
      <MyPopup>
        <MyPopupTrigger>
          <Button size={"clear"}>
            <AdjustmentsHorizontalIcon className="w-5" />
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

import {
  Button,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  MenuWrapper,
} from "@/components";
import { useThemeContext } from "@/stores";
import { ReactNode, useState } from "react";
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
      className="left-[calc(100%)] bottom-full w-[120px]"
      animationClassName="origin-top-left"
    >
      <MenuWrapper>
        <VerticalMenu>{children}</VerticalMenu>
      </MenuWrapper>
    </MyPopupContent>
  );
}

type Props = {
  variant: "my-playlist" | "others-playlist";
};

export default function PlaylistMenuBtn({ variant }: Props) {
  const { theme } = useThemeContext();
  const [isOpenPopup, _setIsOpenPopup] = useState<boolean>(false);

  return (
    <>
      <MyPopup>
        {/*setIsOpenParent={setIsOpenPopup}*/}
        <MyPopupTrigger>
          <Button
            size={"clear"}
            className={`rounded-full p-2.5 ${
              isOpenPopup ? theme.content_bg : "bg-" + theme.alpha
            } $
            } `}
          >
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

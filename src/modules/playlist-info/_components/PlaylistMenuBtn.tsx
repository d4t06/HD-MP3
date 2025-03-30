import { Button } from "@/components";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  TriggerRef,
} from "@/components/MyPopup";
import { useThemeContext } from "@/stores";
import { ReactNode, useRef, useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { MenuList, MenuWrapper } from "@/components/ui/MenuWrapper";
import OtherPlaylistMenu from "./OthersPlaylistMenu";
import OwnPlaylistMenu from "./OwnPlaylistMenu";

export function PlaylistMenuPopupContent({ children }: { children: ReactNode }) {
  return (
    <MyPopupContent
      className="left-[calc(100%)] bottom-full w-[120px]"
      animationClassName="origin-top-left"
      appendTo="parent"
    >
      <MenuWrapper>
        <MenuList>{children}</MenuList>
      </MenuWrapper>
    </MyPopupContent>
  );
}

type Props = {
  variant: "my-playlist" | "others-playlist";
};

export default function PlaylistMenuBtn({ variant }: Props) {
  const { theme } = useThemeContext();
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

  const triggerRef = useRef<TriggerRef>(null);

  return (
    <>
      <MyPopup>
        <MyPopupTrigger setIsOpenParent={setIsOpenPopup} ref={triggerRef}>
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

        {variant === "others-playlist" ? <OtherPlaylistMenu /> : <OwnPlaylistMenu />}
      </MyPopup>
    </>
  );
}

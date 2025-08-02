import {
  InformationCircleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

import VertialMenu from "./popup/VerticalMenu";
import { PopupWrapper } from ".";

type Modal = "theme" | "info";

type Props = {
  openModal: (modal: Modal) => void;
  variant: "client" | "dashboard";
};

export default function SettingMenu({ openModal }: Props) {
  const handleOpenModal = (modal: Modal) => {
    openModal(modal);
  };

  return (
    <>
      <PopupWrapper className="w-[200px] px-2">
        <VertialMenu className="[&>button]:rounded-md">
          <button className={``} onClick={() => handleOpenModal("theme")}>
            <PaintBrushIcon />
            <span>Themes</span>
          </button>

          <button onClick={() => handleOpenModal("info")}>
            <InformationCircleIcon />
            <span>Info</span>
          </button>
        </VertialMenu>
      </PopupWrapper>
    </>
  );
}

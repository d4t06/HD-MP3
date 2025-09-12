import {
  CogIcon,
  InformationCircleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

import VertialMenu from "./popup/VerticalMenu";
import { PopupWrapper, Switch } from ".";

type Modal = "theme" | "info";  

type Props = {
  openModal: (modal: Modal) => void;
  setAnimation: () => void;
  animation: boolean;
};

export default function SettingMenu({
  openModal,
  setAnimation,
  animation,
}: Props) {
  const handleOpenModal = (modal: Modal) => {
    openModal(modal);
  };

  return (
    <>
      <PopupWrapper className="w-[220px] px-2">
        <VertialMenu className="[&>button]:rounded-md">
          <button className={``} onClick={() => handleOpenModal("theme")}>
            <PaintBrushIcon />
            <span>Themes</span>
          </button>

          <button onClick={() => handleOpenModal("info")}>
            <InformationCircleIcon />
            <span>Info</span>
          </button>

          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-1">
              <CogIcon />
              <span>Animation</span>
            </button>
            <Switch active={animation} cb={setAnimation} />
          </div>
        </VertialMenu>
      </PopupWrapper>
    </>
  );
}

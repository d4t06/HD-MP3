// import {
//   CogIcon,
//   InformationCircleIcon,
//   PaintBrushIcon,
// } from "@heroicons/react/24/outline";

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
        <VertialMenu
          size="[&_svg]:w-6 [&>*]:text-sm"
          className="[&>button]:rounded-md [&_img]:w-6"
        >
          <button className={``} onClick={() => handleOpenModal("theme")}>
            <img src="./icons/theme.png" />
            <span>Themes</span>
          </button>

          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2">
              <img src="./icons/start.png" />
              <span>Animation</span>
            </button>
            <Switch active={animation} cb={setAnimation} />
          </div>

          <button onClick={() => handleOpenModal("info")}>
            <img src="./icons/info.png" />
            <span>Info</span>
          </button>
        </VertialMenu>
      </PopupWrapper>
    </>
  );
}

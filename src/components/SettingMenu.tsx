import { InformationCircleIcon, PaintBrushIcon } from "@heroicons/react/24/outline";

import PopupWrapper from "./ui/PopupWrapper";
import { useThemeContext } from "@/stores";

type Modal = "theme" | "info";

type Props = {
  openModal: (modal: Modal) => void;
  variant: "client" | "dashboard";
};

export default function SettingMenu({ openModal, variant }: Props) {
  const { theme } = useThemeContext();

  const handleOpenModal = (modal: Modal) => {
    openModal(modal);
  };

  const classes = {
    menuItem: `hover:bg-[#fff]/5 rounded-md text-sm font-[500] px-2 py-2 inline-flex items-center cursor-pointer`,
    icon: "w-5 mr-2",
    divide: `h-[1px]  w-[calc(100%-20px)] my-[4px] mx-auto bg-[#fff]/5`,
  };

  const renderMenuItem = () => {
    switch (variant) {
      case "client":
        return (
          <>
            <li
              className={`${classes.menuItem}`}
              onClick={() => handleOpenModal("theme")}
            >
              <PaintBrushIcon className={classes.icon} />
              Themes
            </li>
            <div className={classes.divide}></div>

            <li className={`${classes.menuItem}`} onClick={() => handleOpenModal("info")}>
              <InformationCircleIcon className={classes.icon} />
              Info
            </li>
          </>
        );
      case "dashboard":
        return (
          <>
            <li
              className={`${classes.menuItem}`}
              onClick={() => handleOpenModal("theme")}
            >
              <PaintBrushIcon className={classes.icon} />
              Themes
            </li>
            <div className={classes.divide}></div>

            <li className={`${classes.menuItem}`} onClick={() => handleOpenModal("info")}>
              <InformationCircleIcon className={classes.icon} />
              Info
            </li>
          </>
        );
    }
  };

  return (
    <>
      <PopupWrapper theme={theme}>
        <ul className="flex flex-col w-[200px]">{renderMenuItem()}</ul>
      </PopupWrapper>
    </>
  );
}

import {
  InformationCircleIcon,
  PaintBrushIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/store/ThemeContext";

import PopupWrapper from "./ui/PopupWrapper";
import { useLocalStorage } from "../hooks";
import { Switch } from ".";
import { useDispatch } from "react-redux";
import { setPlayStatus } from "@/store/PlayStatusSlice";

type Modal = "theme" | "info";

type Props = {
  openModal: (modal: Modal) => void;
  variant: "client" | "dashboard";
};

export default function SettingMenu({ openModal, variant }: Props) {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const handleOpenModal = (modal: Modal) => {
    openModal(modal);
  };

  const [isCrossFade, setIsCrossFade] = useLocalStorage("isCrossFade", false);

  const handleSetCrossFade = () => {
    setIsCrossFade(!isCrossFade);
    dispatch(setPlayStatus({ isCrossFade: !isCrossFade }));
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
            <li className={`${classes.menuItem} justify-between cursor-default`}>
              <div className="flex items-center">
                <PlayCircleIcon className={classes.icon} />
                Cross fade
              </div>
              <Switch active={isCrossFade} cb={handleSetCrossFade} />
            </li>

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

import {
   DocumentTextIcon,
   InformationCircleIcon,
   PaintBrushIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, MutableRefObject } from "react";
import { useTheme } from "../store/ThemeContext";

import PopupWrapper from "./ui/PopupWrapper";

type Props = {
   modalName: MutableRefObject<"theme" | "info" | "confirm">;
   loggedIn: boolean;
   setIsOpenModal: Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingMenu({ modalName, setIsOpenModal, loggedIn }: Props) {
   const { theme } = useTheme();
   const handleSetComp = (name: "theme" | "info" | "confirm") => {
      modalName.current = name;
      setIsOpenModal(true);
   };

   const classes = {
      menuItem: `${theme.content_hover_text} hover:bg-${theme.alpha} rounded-[4px] w-full px-[10px] text-[14px] h-[40px] inline-flex items-center cursor-pointer`,
      icon: "w-[25px] mr-[8px]",
      divide: `h-[1px]  w-[calc(100%-20px)] my-[4px] mx-auto bg-${theme.alpha}`,
      disable: "opacity-[.6] pointer-events-none",
   };

   return (
      <>
         <PopupWrapper variant={"thin"} color="sidebar" theme={theme}>
            <ul className="flex flex-col w-[170px]">
               <li
                  className={`${classes.menuItem} ${classes.disable}`}
                  onClick={() => handleSetComp("theme")}
               >
                  <PlayCircleIcon className={classes.icon} />
                  Player
               </li>
               <li className={`${classes.menuItem}`} onClick={() => handleSetComp("theme")}>
                  <PaintBrushIcon className={classes.icon} />
                  Themes
               </li>

               <div className={classes.divide}></div>
               <li className={`${classes.menuItem}`} onClick={() => handleSetComp("info")}>
                  <InformationCircleIcon className={classes.icon} />
                  Info
               </li>
               <li className={`${classes.menuItem}`} onClick={() => handleSetComp("info")}>
                  <DocumentTextIcon className={classes.icon} />
                  Privacy
               </li>
            </ul>
         </PopupWrapper>
      </>
   );
}

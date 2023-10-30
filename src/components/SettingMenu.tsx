import {
   ArrowRightOnRectangleIcon,
   InformationCircleIcon,
   PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, MutableRefObject } from "react";
import { useTheme } from "../store/ThemeContext";

import PopupWrapper from "./ui/PopupWrapper";
// import useLocalStorage from "../hooks/useLocalStorage";

type Props = {
   modalName: MutableRefObject<"theme" | "info" | "confirm">;
   loggedIn: boolean;
   setIsOpenMenu: Dispatch<React.SetStateAction<boolean>>;
   setIsOpenModal: Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingMenu({
   // setSettingComp,
   modalName,
   setIsOpenModal,
   loggedIn,
}: Props) {
   // use stores
   const { theme } = useTheme();

   const handleSetComp = (name: "theme" | "info" | "confirm") => {
      // const map = {
      //   'theme': themesScreen,
      //   'info': infoScreen,
      //   'confirm': logoutModal
      // }

      modalName.current = name;
      setIsOpenModal(true);
   };

   return (
      <>
         <PopupWrapper theme={theme}>
            <ul className="flex flex-col gap-[12px]">
               <li className="flex" onClick={() => handleSetComp("theme")}>
                  <PaintBrushIcon className="w-6 h-6 mr-2" />
                  Themes
               </li>
               {loggedIn && (
                  <li className="flex" onClick={() => handleSetComp("confirm")}>
                     <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
                     Log out
                  </li>
               )}
               <li className="flex" onClick={() => handleSetComp("info")}>
                  <InformationCircleIcon className="w-6 h-6 mr-2" />
                  Info
               </li>
            </ul>
         </PopupWrapper>
      </>
   );
}

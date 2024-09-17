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
import { HeaderModal } from "./Header";

type Props = {
   loggedIn: boolean;
   openModal: (modal: HeaderModal) => void;
};

export default function SettingMenu({ openModal }: Props) {
   const { theme } = useTheme();
   const dispatch = useDispatch();
   const handleSetModal = (modal: HeaderModal) => {
      openModal(modal);
   };

   const [isCrossFade, setIsCrossFade] = useLocalStorage("isCrossFade", false);

   const handleSetCrossFade = () => {
      setIsCrossFade(!isCrossFade);
      dispatch(setPlayStatus({ isCrossFade: !isCrossFade }));
   };

   const classes = {
      menuItem: `${theme.content_hover_text} hover:bg-${theme.alpha} rounded-[4px] font-[500] w-full px-[10px] text-[14px] h-[40px] inline-flex items-center cursor-pointer`,
      icon: "w-[25px] mr-[8px]",
      divide: `h-[1px]  w-[calc(100%-20px)] my-[4px] mx-auto bg-${theme.alpha}`,
      disable: "opacity-[.6] pointer-events-none",
   };

   return (
      <>
         <PopupWrapper variant={"thin"} color="sidebar" theme={theme}>
            <ul className="flex flex-col w-[200px]">
               <li className={`${classes.menuItem} justify-between hover:bg-[unset]`}>
                  <div className="flex items-center">
                     <PlayCircleIcon className={classes.icon} />
                     Cross fade
                  </div>
                  <Switch active={isCrossFade} cb={handleSetCrossFade} />
               </li>
               <li
                  className={`${classes.menuItem}`}
                  onClick={() => handleSetModal("theme")}
               >
                  <PaintBrushIcon className={classes.icon} />
                  Themes
               </li>
               <div className={classes.divide}></div>
               <li
                  className={`${classes.menuItem}`}
                  onClick={() => handleSetModal("info")}
               >
                  <InformationCircleIcon className={classes.icon} />
                  Info
               </li>
            </ul>
         </PopupWrapper>
      </>
   );
}

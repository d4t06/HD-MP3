import {
   HomeIcon,
   ClipboardDocumentIcon,
   HeartIcon,
   Cog6ToothIcon,
   QuestionMarkCircleIcon,
   ClockIcon,
   ArrowUpTrayIcon,
   ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
   useFloating,
   autoUpdate,
   offset,
   flip,
   shift,
   FloatingFocusManager,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
} from "@floating-ui/react";
import { Component, FC, ReactNode, useState } from "react";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import Modal from "./Modal";
import SettingMenu from "./SettingMenu";
import { useTheme } from "../store/ThemeContext";

export default function Sidebar() {
   const { theme } = useTheme();
   const [isOpenMenu, setIsOpenMenu] = useState(false);

   const [isOpenSetting, setIsOpenSetting] = useState(false);

   const [settingComp, setSettingComp] = useState<ReactNode>();

   const { refs, floatingStyles, context } = useFloating({
      open: isOpenMenu,
      onOpenChange: setIsOpenMenu,
      placement: "right-start",
      middleware: [offset(0), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });

   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);

   const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
   ]);

   // console.log('sidebar render');

   const textClass = theme.type === "light" ? "text-[#333]" : "text-white";
   const buttonClasses = `px-[10px] py-[5px] w-full text-sm font-[500] ${theme.content_hover_text}`;

   return (
      <div
         className={`text-md pt-[30px] w-[180px] flex-shrink-0 border-r-[1px]  h-screen overflow-y-auto max-[549px]:hidden
            ${theme.side_bar_bg} border-${theme.alpha} ${textClass}
         `}
      >
         <div className="flex flex-col gap-3 items-start">
            <Button className={buttonClasses}>
               <Link className="abc" to={routes.home}>
                  <HomeIcon className="w-6 h-6 mr-2 inline" />
                  Home
               </Link>
            </Button>

            <Button className={buttonClasses}>
               <Link className="abc" to={routes.playlist}>
                  <ClipboardDocumentIcon className="w-6 h-6 mr-2 inline" />
                  My Playlist
               </Link>
            </Button>
            <Button className={buttonClasses}>
               <Link to={routes.favorite}>
                  <HeartIcon className="w-6 h-6 mr-2 inline" />
                  Liked
               </Link>
            </Button>
            {/* <Button className={buttonClasses}>
               <ClockIcon className="w-6 h-6 mr-2" />
               Last Play
            </Button> */}
         </div>

         {/* <Divider className="h-[1px] my-4" /> */}
         <div
            className={`h-[1px]  w-[calc(100%-20px)] my-[20px] mx-auto bg-${theme.alpha}`}
         ></div>

         <div className="flex flex-col gap-3 items-start">
             <Button className={buttonClasses}>
               <Link to={routes.upload}>
                  <ArrowUpOnSquareIcon className="w-6 h-6 mr-2 inline" />
                  Upload song
               </Link>
            </Button>
            <button
               ref={refs.setReference}
               {...getReferenceProps()}
               // onClick={() => setIsOpenSetting(true)}
               className={`inline-flex items-center hover:brightness-75 ${buttonClasses} ${
                  isOpenMenu && theme.content_text
               }`}
            >
               <Cog6ToothIcon className="w-6 h-6 mr-2" />
               Settings
            </button>
         </div>

         {isOpenMenu && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <SettingMenu
                     setIsOpenMenu={setIsOpenMenu}
                     setIsOpenSetting={setIsOpenSetting}
                     setSettingComp={setSettingComp}
                  />
               </div>
            </FloatingFocusManager>
         )}

         {isOpenSetting && (
            <Modal setOpenModal={setIsOpenSetting}>
               <div
                  className={`w-[700px] max-w-[90vw] max-h-[70vh] p-[25px] overflow-hidden ${
                     theme.container
                  } rounded-[8px] ${
                     theme.type === "light" ? "text-[#333]" : "text-white"
                  } `}
               >
                  {settingComp}
               </div>
            </Modal>
         )}
      </div>
   );
}

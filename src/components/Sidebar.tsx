import {
   HomeIcon,
   Cog6ToothIcon,
   ArrowLeftOnRectangleIcon,
   MusicalNoteIcon,
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
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { ReactNode, useState } from "react";
import Button from "./ui/Button";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import Modal from "./Modal";
import SettingMenu from "./SettingMenu";
import { useTheme } from "../store/ThemeContext";
import { auth } from "../config/firebase";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/ToolTip";

export default function Sidebar() {
   const [signInWithGoogle] = useSignInWithGoogle(auth);

   const { theme } = useTheme();
   const [loggedInUser, _loading] = useAuthState(auth);

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

   const signIn = () => {
      signInWithGoogle();
   };

   // console.log('sidebar render');

   const textClass = theme.type === "light" ? "text-[#333]" : "text-white";
   const buttonClasses = `px-[10px] py-[5px] w-full text-sm font-[500] ${theme.content_hover_text}`;

   return (
      <div
         className={`text-md pt-[30px] w-[180px] flex-shrink-0 border-r-[1px]  h-screen overflow-y-auto max-[549px]:hidden
            ${theme.side_bar_bg} border-${theme.alpha} ${textClass}
         `}
      >
         <div className="px-[10px] flex items-center">
            <Tooltip>
               <TooltipTrigger>
                  <div
                     className={`w-[36px] h-[36px] flex-shrink-0 rounded-full overflow-hidden 
            ${
               !loggedInUser?.photoURL
                  ? "flex items-center justify-center bg-[#ccc]"
                  : ""
            }`}
                  >
                     {loggedInUser?.photoURL ? (
                        <img
                           src={loggedInUser.photoURL!}
                           className="w-full"
                           alt=""
                        />
                     ) : (
                        <h1 className="text-[20px]">
                           {loggedInUser
                              ? loggedInUser?.displayName?.charAt(1)
                              : "Z"}
                        </h1>
                     )}
                  </div>
               </TooltipTrigger>
               <TooltipContent>
                  <div className={`bg-[#ccc] text-[#333] text-[14px] px-[10px] py-[2px] rounded-[4px]`}>
                  {loggedInUser ? loggedInUser?.displayName : "Zingmp3"}
                  </div>
               </TooltipContent>
            </Tooltip>

            <h3 className="text-[16px] font-[500] ml-[8px] line-clamp-1">
               {loggedInUser ? loggedInUser?.displayName : "Guest"}
            </h3>
         </div>
         <div
            className={`h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-${theme.alpha}`}
         ></div>

         <div className="flex flex-col gap-[15px] items-start">
            <Button className={buttonClasses}>
               <Link className="abc" to={routes.home}>
                  <HomeIcon className="w-6 h-6 mr-2 inline" />
                  Discover
               </Link>
            </Button>
            {loggedInUser ? (
               <Button className={buttonClasses}>
                  <Link to={routes.allSong}>
                     <MusicalNoteIcon className="w-6 h-6 mr-2 inline" />
                     My songs
                  </Link>
               </Button>
            ) : (
               <Button onClick={() => signIn()} className={buttonClasses}>
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-2 inline" />
                  Login
               </Button>
            )}
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
                     loggedInUser={loggedInUser}
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

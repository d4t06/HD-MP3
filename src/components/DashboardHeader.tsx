import { useTheme } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

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
import { ReactNode, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Modal, PopupWrapper, SettingMenu } from ".";

export default function DashboardHeader() {
   const { theme } = useTheme();
   const [loggedInUser] = useAuthState(auth);

   const [settingComp, setSettingComp] = useState<ReactNode>();
   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);

   // floating ui
   const { refs, floatingStyles, context } = useFloating({
      open: isOpenMenu,
      onOpenChange: setIsOpenMenu,
      placement: "bottom-end",
      middleware: [offset(20), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);


   const textColor = theme.type === 'light' ? 'text-[#333]' : 'text-[#fff]'

   return (
      <>

         <div className={`${theme.side_bar_bg} ${textColor}`}>
            <div className="container mx-auto flex justify-between items-center h-[50px]">
               <h1 className="text-[20px] uppercase">Zing dash board</h1>

               <div className="flex items-center">
                  {loggedInUser?.displayName && (
                     <p className="text-[14px] mr-[8px]">{loggedInUser.displayName}</p>
                  )}
                  <div
                     className={`w-[30px] h-[30px] rounded-full overflow-hidden border-[#ccc] border`}
                  >
                     {loggedInUser?.photoURL && (
                        <img src={loggedInUser.photoURL!} className="w-full" alt="" />
                     )}
                  </div>
                  <button
                     ref={refs.setReference}
                     {...getReferenceProps()}
                     className={`flex ml-[12px] justify-center rounded-full items-center h-[30px] w-[30px] hover:brightness-75  ${
                        isOpenMenu && theme.content_text
                     } bg-${theme.alpha}`}
                  >
                     <Cog6ToothIcon className="w-[24px]" />
                  </button>
               </div>
            </div>
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
                     loggedIn={!!loggedInUser?.email}
                     setIsOpenMenu={setIsOpenMenu}
                     setIsOpenSetting={setIsOpenModal}
                     setSettingComp={setSettingComp}
                  />
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>{settingComp}</PopupWrapper>
            </Modal>
         )}
      </>
   );
}

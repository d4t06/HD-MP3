import { useTheme } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

import { useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { AppInfo, Appearance, ConfirmModal, Modal, SettingMenu } from ".";
import zingIcon from "../assets/icon-zing.svg";

import { useAuthActions } from "../store/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

export default function DashboardHeader() {
   const { theme } = useTheme();
   const [loggedInUser] = useAuthState(auth);

   const [isOpenModal, setIsOpenModal] = useState(false);
   const modalName = useRef<"theme" | "info" | "confirm">("confirm");

   // hook
   const { logOut } = useAuthActions();

   // floating ui

   const handleSignOut = async () => {
      try {
         await logOut();
      } catch (error) {
         console.log("signOut error", { messsage: error });
      } finally {
         setIsOpenModal(false);
      }
   };

   return (
      <>
         <div className={`${theme.side_bar_bg} fixed top-0 z-10 left-0 right-0`}>
            <div className="container mx-auto flex justify-between items-center h-[50px]">
               <div className="flex">
                  <img className="w-[30px]" src={zingIcon} alt="" />
                  <h1 className="text-[20px] uppercase ml-[10px]">Zing admin</h1>
               </div>

               <div className="flex items-center">
                  {loggedInUser?.displayName && (
                     <p className="text-[14px] mr-[8px]">{loggedInUser.displayName}</p>
                  )}
                  <div
                     className={`w-[30px] h-[30px] rounded-full overflow-hidden border-[#ccc] border-[2px]`}
                  >
                     {loggedInUser?.photoURL && (
                        <img src={loggedInUser.photoURL!} className="w-full" alt="" />
                     )}
                  </div>

                  <Popover>
                     <PopoverTrigger
                        className={`flex ml-[12px] justify-center rounded-full items-center h-[30px] w-[30px] hover:brightness-75   bg-${theme.alpha}`}
                     >
                        <Cog6ToothIcon className="w-[24px]" />
                     </PopoverTrigger>

                     <PopoverContent>
                        <SettingMenu
                           loggedIn={false}
                           setIsOpenModal={setIsOpenModal}
                           modalName={modalName}
                        />
                     </PopoverContent>
                  </Popover>
               </div>
            </div>
         </div>

         {isOpenModal && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalName.current === "confirm" && (
                  <ConfirmModal
                     setOpenModal={setIsOpenModal}
                     callback={handleSignOut}
                     loading={false}
                     theme={theme}
                     label="Log out ?"
                  />
               )}
               {modalName.current === "info" && <AppInfo setIsOpenModal={setIsOpenModal} />}
               {modalName.current === "theme" && <Appearance setIsOpenModal={setIsOpenModal} />}
            </Modal>
         )}
      </>
   );
}

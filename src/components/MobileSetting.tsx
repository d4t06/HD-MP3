import {
   ArrowRightOnRectangleIcon,
   InformationCircleIcon,
   PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { AppInfo, Appearance, Avatar, ConfirmModal, LinkItem, Modal, Skeleton } from ".";
import { useAuthStore, useTheme } from "../store";
import { MobileLinkSkeleton } from "./skeleton";
import { useMemo, useState } from "react";
import { useAuthActions } from "../store/AuthContext";

type Modal = "theme" | "info" | "logout";

export default function MobileSetting() {
   const { theme } = useTheme();
   const { loading: userLoading, user } = useAuthStore();

   //    hooks
   const { logOut } = useAuthActions();

   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   const closeModal = () => setIsOpenModal("");

   const handleSignOut = async () => {
      try {
         await logOut();
      } catch (error) {
         console.log("signOut error", { messsage: error });
      } finally {
         closeModal();
      }
   };

   const renderModal = useMemo(() => {
      switch (isOpenModal) {
         case "theme":
            return <Appearance close={closeModal} />;
         case "info":
            return <AppInfo close={closeModal} />;
         case "logout":
            return (
               <ConfirmModal
                  close={closeModal}
                  callback={handleSignOut}
                  loading={false}
                  theme={theme}
                  label="Log out ?"
               />
            );
      }
   }, [isOpenModal]);

   // define styles
   const classes = {
      linkItem: `py-[10px] border-b border-${theme.alpha} last:border-none`,
      button: `${theme.content_bg} rounded-full`,
      icon: `w-[24px] mr-2`,
   };

   return (
      <>
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[10px]">Setting</h3>
            <Avatar className="h-[65px] w-[65px]" />
            {userLoading ? (
               <Skeleton className="my-[8px] h-[27px]" />
            ) : (
               <p className="text-[18px] font-[500] my-[8px]">
                  {user ? user.display_name : "Guest"}
               </p>
            )}

            {userLoading ? (
               [...Array(3).keys()].map(() => MobileLinkSkeleton)
            ) : (
               <>
                  <LinkItem
                     className={classes.linkItem}
                     icon={<PaintBrushIcon className={classes.icon} />}
                     label="Theme"
                     onClick={() => setIsOpenModal("theme")}
                  />
                  <LinkItem
                     className={classes.linkItem}
                     icon={<InformationCircleIcon className={classes.icon} />}
                     label="Info"
                     onClick={() => setIsOpenModal("info")}
                  />
                  {user && (
                     <LinkItem
                        className={classes.linkItem}
                        icon={<ArrowRightOnRectangleIcon className={classes.icon} />}
                        label="Logout"
                        onClick={() => setIsOpenModal("logout")}
                     />
                  )}
               </>
            )}
         </div>

         {isOpenModal && (
            <Modal closeModal={closeModal}>
               {renderModal}
            </Modal>
         )}
      </>
   );
}

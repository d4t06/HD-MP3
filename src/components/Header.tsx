import { RefObject, useEffect, useRef, useState } from "react";
import { useTheme } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import {
   AppInfo,
   Appearance,
   Avatar,
   ConfirmModal,
   Skeleton,
   Modal,
   SettingMenu,
   PopupWrapper,
} from ".";
import {
   ArrowLeftOnRectangleIcon,
   ArrowRightOnRectangleIcon,
   Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuthActions } from "../store/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

function Header({ contentRef }: { contentRef: RefObject<HTMLDivElement> }) {
   const { theme } = useTheme();

   const [loggedInUser, loading] = useAuthState(auth);

   const [scroll, setScroll] = useState(0);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const modalName = useRef<"theme" | "info" | "confirm">("theme");

   //  use hooks
   const { logOut, logIn } = useAuthActions();

   const handleOpenModal = (name: typeof modalName.current) => {
      setIsOpenModal(true);
      modalName.current = name;
   };

   const handleSignOut = async () => {
      try {
         await logOut();
      } catch (error) {
         console.log("signOut error", { messsage: error });
      } finally {
         setIsOpenModal(false);
      }
   };

   //   methods
   const handleLogIn = async () => {
      try {
         const btnEle = document.querySelector(".login-trigger") as HTMLElement;
         await logIn();
         if (btnEle) btnEle.click();
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      const contentEle = contentRef.current as HTMLDivElement;
      if (!contentEle) return;

      contentEle.onscroll = () => setScroll(contentEle.scrollTop);
      return () => {
         contentEle.onscroll = () => {};
      };
   }, []);

   const AvatarSkeleton = <Skeleton className="w-[35px] h-[35px] rounded-full" />;

   const classes = {
      userName: `text-[16px] font-[500] ml-[8px] line-clamp-1`,
      button: `h-[35px] w-[35px] inline-flex items-center justify-center rounded-full bg-${theme.alpha} ${theme.content_hover_text}`,
      menuItem: `hover:bg-${theme.alpha} ${theme.content_hover_text} rounded-[4px] w-full px-[10px] h-[44px] inline-flex items-center`,
      icon: "w-[25px] mr-[5px]",
      divide: `h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-${theme.alpha}`,
   };

   return (
      <>
         <div
            className={`${theme.container} ${scroll ? "shadow-lg" : ""} h-[60px] fixed right-0 ${
               scroll ? "bg-transparent" : ""
            } left-[180px] z-[10]`}
         >
            <div
               className={`${scroll ? "" : "hidden "} absolute inset-0 ${
                  theme.container
               } bg-opacity-[0.9] backdrop-blur-[15px] z-[-1] `}
            ></div>

            <div className="px-[40px] flex items-center justify-between h-full">
               {/* left */}
               <div className=""></div>
               {/* right */}
               <div className="flex gap-[16px]">
                  <Popover placement="bottom-end">
                     <PopoverTrigger
                        className={`flex items-center hover:brightness-75 ${classes.button}`}
                     >
                        <Cog6ToothIcon className={`w-[20px]`} />
                     </PopoverTrigger>
                     <PopoverContent>
                        <SettingMenu
                           loggedIn={false}
                           setIsOpenModal={setIsOpenModal}
                           modalName={modalName}
                        />
                     </PopoverContent>
                  </Popover>

                  <Popover placement="bottom-end">
                     <PopoverTrigger
                        className={`flex login-trigger items-center hover:brightness-75 ${classes.button}`}
                     >
                        {loading ? AvatarSkeleton : <Avatar />}
                     </PopoverTrigger>
                     <PopoverContent>
                        <PopupWrapper color="sidebar" variant={"thin"} theme={theme}>
                           <div className="w-[250px] max-h-[50vh]">
                              {loggedInUser && (
                                 <>
                                    <div className="flex items-center p-[10px] pb-0">
                                       <Avatar className="login-trigger w-[46px] h-[46px]" />

                                       <div className="ml-[12px]">
                                          <h5 className="font-semibold line-clamp-1">
                                             {loggedInUser?.displayName}
                                          </h5>
                                       </div>
                                    </div>

                                    <div className={classes.divide}></div>
                                    <button
                                       className={`${classes.menuItem}`}
                                       onClick={() => handleOpenModal("confirm")}
                                    >
                                       <ArrowRightOnRectangleIcon className={classes.icon} />
                                       Log out
                                    </button>
                                 </>
                              )}

                              {!loggedInUser && (
                                 <button className={`${classes.menuItem}`} onClick={handleLogIn}>
                                    <ArrowLeftOnRectangleIcon className={classes.icon} />
                                    Log in
                                 </button>
                              )}
                           </div>
                        </PopupWrapper>
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
                     label="Sign out ?"
                     desc=""
                     theme={theme}
                  />
               )}
               {modalName.current === "info" && <AppInfo setIsOpenModal={setIsOpenModal} />}
               {modalName.current === "theme" && <Appearance setIsOpenModal={setIsOpenModal} />}
            </Modal>
         )}
      </>
   );
}

export default Header;

import {
   HomeIcon,
   Cog6ToothIcon,
   ArrowLeftOnRectangleIcon,
   MusicalNoteIcon,
   ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import {
   useFloating,
   autoUpdate,
   offset,
   FloatingFocusManager,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { routes } from "../routes";
import {
   Button,
   SettingMenu,
   Skeleton,
   Modal,
   AppInfo,
   Appearance,
   Avatar,
   ConfirmModal,
} from "../components";

import { auth } from "../config/firebase";

import { useTheme, useAuthStore } from "../store";
import { useAuthActions } from "../store/AuthContext";

export default function Sidebar() {
   // use store
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const [loggedInUser, loading] = useAuthState(auth);

   // state
   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const modalName = useRef<"theme" | "info" | "confirm">("theme");

   // floating ui
   const { refs, floatingStyles, context } = useFloating({
      open: isOpenMenu,
      onOpenChange: setIsOpenMenu,
      placement: "right-start",
      middleware: [offset(0)],
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

   //  use hooks
   const { logIn, logOut } = useAuthActions();

   //   methods
   const handleLogIn = async () => {
      try {
         await logIn();
      } catch (error) {
         console.log(error);
      } finally {
         setIsOpenModal(false);
      }
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

   // define skeleton
   const menuItemSkeletons = [...Array(3).keys()].map((index) => {
      return (
         <div key={index} className="px-[10px] py-[5px] flex items-center">
            <Skeleton className="w-[25px] h-[25px] flex-shrink-0" />
            <Skeleton className="w-[80px] h-[19px] ml-[5px]" />
         </div>
      );
   });
   const AvatarSkeleton = (
      <div className="flex items-center">
         <Skeleton className="w-[36px] h-[36px] flex-shrink-0 rounded-full" />
         <Skeleton className="w-[104px] h-[20px] ml-[5px]" />
      </div>
   );

   //  define styles
   const classes = {
      container: `pt-[30px] w-[180px] flex-shrink-0 border-r-[1px] h-screen overflow-y-auto ${theme.side_bar_bg} border-${theme.alpha}`,
      button: `px-[10px] py-[5px] w-full text-[14px] font-[500] ${theme.content_hover_text}`,
      text: theme.type === "light" ? "text-[#333]" : "text-white",
      icon: "w-[25px] mr-[5px]",
      divide: `h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-${theme.alpha}`,
      userName: `text-[16px] font-[500] ml-[8px] line-clamp-1`,
      imageFrame: `w-[36px] h-[36px] flex-shrink-0 rounded-full overflow-hidden ${
         !loggedInUser?.photoURL ? "flex items-center justify-center bg-[#ccc]" : ""
      }`,
      popupWrapper: "w-[700px] max-w-[90vw] max-[549px]:w-[85vw]",
      themeContainer: "overflow-auto no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
      themeList: "flex flex-row -mx-[10px] flex-wrap gap-y-[20px]",
      themeItem: "w-[25%] px-[10px] max-[549px]:w-[50%]",
   };

   return (
      <div className={`${classes.container} ${classes.text}`}>
         <div className="px-[10px] flex items-center">
            {loading ? (
               AvatarSkeleton
            ) : (
               <>
                  <Avatar />
                  <h3 className={classes.userName}>
                     {loggedInUser?.displayName || "Guest"}
                  </h3>
               </>
            )}
         </div>
         <div className={classes.divide}></div>

         <div className="flex flex-col gap-[15px] items-start">
            {userInfo.status === "loading" && menuItemSkeletons}

            {userInfo.status !== "loading" && (
               <>
                  <Link className="w-full" to={routes.Home}>
                     <Button className={classes.button}>
                        <HomeIcon className={classes.icon} />
                        Discover
                     </Button>
                  </Link>
                  {loggedInUser?.email ? (
                     <>
                        <Link className="w-full" to={routes.MySongs}>
                           <Button className={classes.button}>
                              <MusicalNoteIcon className={classes.icon} />
                              My songs
                           </Button>
                        </Link>
                        {/* <Link className="w-full" to={routes.MySongs}>
                           <Button className={classes.button}>
                              <MusicalNoteIcon className={classes.icon} />
                              Favorite
                           </Button>
                        </Link> */}
                     </>
                  ) : (
                     <Button onClick={handleLogIn} className={classes.button}>
                        <ArrowLeftOnRectangleIcon className={classes.icon} />
                        Login
                     </Button>
                  )}
                  <button
                     ref={refs.setReference}
                     {...getReferenceProps()}
                     className={`flex items-center hover:brightness-75 ${
                        classes.button
                     } ${isOpenMenu && theme.content_text}`}
                  >
                     <Cog6ToothIcon className={classes.icon} />
                     Settings
                  </button>
                  {userInfo.role === "admin" && (
                     <Link className="w-full" to={routes.Dashboard}>
                        <Button className={classes.button}>
                           <ComputerDesktopIcon className={classes.icon} />
                           Dashboard
                        </Button>
                     </Link>
                  )}
               </>
            )}
         </div>

         {isOpenMenu && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99] floating-ui"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <SettingMenu
                     loggedIn={!!userInfo.email}
                     setIsOpenModal={setIsOpenModal}
                     modalName={modalName}
                  />
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && (
            <Modal
               classNames={modalName.current === "theme" ? "w-[900px] max-w-[90vw]" : ""}
               theme={theme}
               setOpenModal={setIsOpenModal}
            >
               {modalName.current === "confirm" && (
                  <ConfirmModal
                     setOpenModal={setIsOpenModal}
                     callback={handleSignOut}
                     loading={false}
                     theme={theme}
                  />
               )}
               {modalName.current === "info" && (
                  <AppInfo setIsOpenModal={setIsOpenModal} />
               )}
               {modalName.current === "theme" && (
                  <Appearance setIsOpenModal={setIsOpenModal} />
               )}
            </Modal>
         )}
      </div>
   );
}

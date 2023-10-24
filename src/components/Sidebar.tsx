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
import { useState } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

import { Button, SettingMenu, Image, Skeleton } from "../components";

import { auth } from "../config/firebase";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { useTheme, useAuthStore } from "../store";

export default function Sidebar() {
   // use store
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const [loggedInUser, loading] = useAuthState(auth);
   const [signInWithGoogle] = useSignInWithGoogle(auth);

   // state
   const [isOpenMenu, setIsOpenMenu] = useState(false);

   // floating ui
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
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

   const signIn = () => {
      signInWithGoogle();
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
   const avatarSkeleton = (
      <div className="flex items-center">
         <Skeleton className="w-[36px] h-[36px] flex-shrink-0 rounded-full" />
         <Skeleton className="w-[104px] h-[16px] ml-[5px]" />
      </div>
   );

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
   };

   return (
      <div className={`${classes.container} ${classes.text}`}>
         <div className="px-[10px] flex items-center">
            {loading ? (
               avatarSkeleton
            ) : (
               <>
                  <div className={classes.imageFrame}>
                     {loggedInUser?.photoURL ? (
                        <Image src={loggedInUser.photoURL!} classNames="w-full" />
                     ) : (
                        <h1 className="text-[20px]">
                           {loggedInUser?.email ? loggedInUser?.displayName?.charAt(1) : "Z"}
                        </h1>
                     )}
                  </div>
                  <h3 className={classes.userName}>
                     {loggedInUser?.email ? loggedInUser?.displayName : "Guest"}
                  </h3>
               </>
            )}
         </div>
         <div className={classes.divide}></div>

         <div className="flex flex-col gap-[15px] items-start">
            {loading && menuItemSkeletons}

            {!loading && (
               <>
                  <Link className="w-full" to={routes.Home}>
                     <Button className={classes.button}>
                        <HomeIcon className={classes.icon} />
                        Discover
                     </Button>
                  </Link>
                  {loggedInUser?.email ? (
                     <Link className="w-full" to={routes.MySongs}>
                        <Button className={classes.button}>
                           <MusicalNoteIcon className={classes.icon} />
                           My songs
                        </Button>
                     </Link>
                  ) : (
                     <Button onClick={() => signIn()} className={classes.button}>
                        <ArrowLeftOnRectangleIcon className={classes.icon} />
                        Login
                     </Button>
                  )}
                  <button
                     ref={refs.setReference}
                     {...getReferenceProps()}
                     className={`flex items-center hover:brightness-75 ${classes.button} ${
                        isOpenMenu && theme.content_text
                     }`}
                  >
                     <Cog6ToothIcon className={classes.icon} />
                     Settings
                  </button>
               </>
            )}
         </div>

         {isOpenMenu && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99]"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  <SettingMenu loggedIn={!!userInfo.email} setIsOpenMenu={setIsOpenMenu} />
               </div>
            </FloatingFocusManager>
         )}
      </div>
   );
}

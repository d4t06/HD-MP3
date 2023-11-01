import { useAuthStore, useSongsStore, useTheme } from "../store";
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
import { useMemo, useRef, useState } from "react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Modal, SettingMenu, confirmModal } from ".";
import { signOut } from "firebase/auth";
import { initialState } from "../store/AuthContext";
import { initialSongs } from "../store/SongsContext";
import { useNavigate } from "react-router-dom";
import { themes } from "../config/themes";
import ThemeItem from "./child/ThemeItem";
import { routes } from "../routes";
import { ThemeType } from "../types";

export default function DashboardHeader() {
   const { theme, setTheme } = useTheme();
   const [loggedInUser] = useAuthState(auth);
   const {setUserInfo} = useAuthStore() 
   const {initSongsContext} = useSongsStore()

   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false)
   const modalName = useRef<"theme" | "info" | "confirm">("confirm");

   // hook
   const navigate = useNavigate()

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
   const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
   ]);

   const handleSignOut = async () => {
      try {
         await signOut(auth);
         // reset userInfo
         // after set sign cause trigger auth useEffect and will update status to 'finish'
         setUserInfo(initialState.userInfo);
         // reset song context
         initSongsContext(initialSongs);
         // reset song redux

         navigate(routes.Home);
      } catch (error) {
         console.log("signOut error", { messsage: error });
      } finally {
         setIsOpenModal(false);
      }
   };

   const handleSetTheme = (theme: ThemeType) => {
      localStorage.setItem("theme", JSON.stringify(theme.id));
      setTheme(theme);
   };


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
   

      // modal
      const renderHeader = (title: string) => {
         return (
            <div className="flex justify-between py-[15px]">
               <h1 className="text-[26px] font-semibold">{title}</h1>
               <Button
                  onClick={() => setIsOpenModal(false)}
                  size={"normal"}
                  variant={"circle"}
               >
                  <XMarkIcon />
               </Button>
            </div>
         );
      };
   
      const infoScreen = useMemo(
         () => (
            <div className={classes.popupWrapper}>
               {renderHeader("Zingmp3 clone")}
               <div className="">
                  <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
                  <ul>
                     {/* <li className="text-lg my-[10px] ml-[20px]">- React - Vite</li>
                    <li className="text-lg my-[10px]  ml-[20px]">- Tailwind css</li> */}
                     {/* <li className="text-lg my-[10px]  ml-[20px]">
                   - Này tui lấy của người ta nên hông biết &#128535; &#128535; &#128535;
                 </li> */}
                  </ul>
                  <a href="asldj" target="_blank" className="text-lg font-bold">
                     #Github
                  </a>
               </div>
            </div>
         ),
         []
      );
   
      const darkTheme: JSX.Element[] = [];
      const lightTheme: JSX.Element[] = [];
   
      useMemo(() => {
         themes.forEach((themeItem, index) => {
            const active = themeItem.id === theme.id;
            if (themeItem.type === "dark")
               return darkTheme.push(
                  <ThemeItem
                     active={active}
                     key={index}
                     theme={themeItem}
                     onClick={handleSetTheme}
                  />
               );
   
            lightTheme.push(
               <ThemeItem
                  active={active}
                  key={index}
                  theme={themeItem}
                  onClick={handleSetTheme}
               />
            );
         });
      }, [theme]);
   
      const themesScreen = useMemo(
         () => (
            <div className={classes.popupWrapper}>
               {renderHeader("Appearance")}
               <div className={classes.themeContainer}>
                  <h2 className="text-md font-semibold mb-[10px]">Dark</h2>
                  <div className={classes.themeList}>{darkTheme}</div>
   
                  <h2 className="text-md font-semibold mb-[10px] mt-[30px]">Light</h2>
                  <div className={classes.themeList}>{lightTheme}</div>
               </div>
            </div>
         ),
         [theme]
      );
   
      const logoutModal = useMemo(
         () =>
            confirmModal({
               loading: false,
               label: "Log out ?",
               theme: theme,
               callback: handleSignOut,
               className: "w-[auto]",
               setOpenModal: setIsOpenModal,
            }),
         [theme]
      );

   return (
      <>
         <div className={`${theme.side_bar_bg}`}>
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
                     modalName={modalName}
                     loggedIn={!!loggedInUser?.email}
                     setIsOpenModal={setIsOpenModal}
                  />
               </div>
            </FloatingFocusManager>
         )}

         {isOpenModal && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {/* <PopupWrapper theme={theme}> */}
               {modalName.current === "confirm" && logoutModal}
               {modalName.current === "info" && infoScreen}
               {modalName.current === "theme" && themesScreen}
               {/* </PopupWrapper> */}
            </Modal>
         )}
      </>
   );
}

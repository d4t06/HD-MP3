import {
   HomeIcon,
   Cog6ToothIcon,
   ArrowLeftOnRectangleIcon,
   MusicalNoteIcon,
   XMarkIcon,
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
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { routes } from "../routes";
import { ThemeType } from "../types";
import {
   Button,
   SettingMenu,
   Image,
   Skeleton,
   confirmModal,
   Modal,
} from "../components";
import ThemeItem from "./child/ThemeItem";

import { auth } from "../config/firebase";
import { themes } from "../config/themes";

import { useTheme, useAuthStore, useSongsStore, setSong } from "../store";
import { initialState } from "../store/AuthContext";
import { initialSongs } from "../store/SongsContext";

export default function Sidebar() {
   // use store
   const dispatch = useDispatch();
   const { theme, setTheme } = useTheme();
   const { userInfo, setUserInfo } = useAuthStore();
   const [loggedInUser, loading] = useAuthState(auth);
   const [signInWithGoogle] = useSignInWithGoogle(auth);
   const { initSongsContext } = useSongsStore();

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
   const navigate = useNavigate();

   //   methods
   const signIn = async () => {
      try {
         const userCredential = await signInWithGoogle();
         //  reset song context
         if (userCredential) {
            // reset song redux
            dispatch(setSong());
             // reset song context
            initSongsContext({ adminSongs: [], adminPlaylists: [] });
            // reset userInfo
            // after set sign cause trigger auth useEffect and will update status to 'finish'
            setUserInfo({ status: "loading" });

            navigate(routes.Home);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleSignOut = async () => {
      try {
         await signOut(auth);
         // reset userInfo
         // after set sign cause trigger auth useEffect and will update status to 'finish'
         setUserInfo(initialState.userInfo);
         // reset song context
         initSongsContext(initialSongs);
         // reset song redux
         dispatch(setSong());

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
                           {loggedInUser?.email
                              ? loggedInUser?.displayName?.charAt(1)
                              : "Z"}
                        </h1>
                     )}
                  </div>
                  {loggedInUser?.email && (
                     <h3 className={classes.userName}>{loggedInUser?.displayName}</h3>
                  )}
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
                     className={`flex items-center hover:brightness-75 ${
                        classes.button
                     } ${isOpenMenu && theme.content_text}`}
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
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {/* <PopupWrapper theme={theme}> */}
               {modalName.current === "confirm" && logoutModal}
               {modalName.current === "info" && infoScreen}
               {modalName.current === "theme" && themesScreen}
               {/* </PopupWrapper> */}
            </Modal>
         )}
      </div>
   );
}

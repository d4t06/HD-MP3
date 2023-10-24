import {
   ArrowRightOnRectangleIcon,
   InformationCircleIcon,
   PaintBrushIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { Dispatch, useCallback, useMemo, useRef, useState } from "react";
import { useTheme } from "../store/ThemeContext";
import { ThemeType } from "../types";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import PopupWrapper from "./ui/PopupWrapper";
import { initialState, useAuthStore } from "../store/AuthContext";
import { useSongsStore } from "../store/SongsContext";
import Modal, { confirmModal } from "./Modal";
import { themes } from "../config/themes";
import ThemeItem from "./child/ThemeItem";
// import useLocalStorage from "../hooks/useLocalStorage";

type Props = {
   setIsOpenMenu: Dispatch<React.SetStateAction<boolean>>;
   loggedIn: boolean;
};

export default function SettingMenu({
   // setSettingComp,
   setIsOpenMenu,
   // setModalName,
   loggedIn,
}: Props) {
   // use stores
   const { theme, setTheme } = useTheme();
   const { setUserInfo } = useAuthStore();
   const { initSongsContext, adminSongs, adminPlaylists } = useSongsStore();

   // state
   const [isOpenModal, setIsOpenModal] = useState(false);
   const modalName = useRef<"theme" | "info" | "confirm">();

   const handleSetTheme = useCallback((theme: ThemeType) => {
      localStorage.setItem("theme", JSON.stringify(theme.id));
      setTheme(theme);
   }, []);

   const renderHeader = (title: string) => {
      return (
         <div className="flex justify-between py-[15px]">
            <h1 className="text-[26px] font-semibold">{title}</h1>
            <Button onClick={() => closeModal()} size={"normal"} variant={"circle"}>
               <XMarkIcon />
            </Button>
         </div>
      );
   };

   const handleSignOut = async () => {
      try {
         await signOut(auth);
         // clear auth store
         setUserInfo({ ...initialState.userInfo, status: "finish" });
         // clear songs store
         initSongsContext({ adminSongs, adminPlaylists });

         closeModal();
      } catch (error) {
         console.log("signOut error", { messsage: error });
      }
   };

   const handleSetComp = (name: string) => {
      switch (name) {
         case "theme":
            modalName.current = "theme";
            break;
         case "info":
            modalName.current = "info";
            break;
         case "logout":
            modalName.current = "confirm";
            break;
         default:
            modalName.current = "info";
            console.log("invalid case");
      }

      setIsOpenModal(true);
   };

   const closeModal = () => {
      setIsOpenModal(false);
      setIsOpenMenu(false);
   };

   const classes = {
      popupWrapper: "w-[700px] max-w-[90vw] max-[549px]:w-[85vw]",
      themeContainer: "overflow-auto no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
      themeList: "flex flex-row -mx-[10px] flex-wrap gap-y-[20px]",
      themeItem: "w-[25%] px-[10px] max-[549px]:w-[50%]",
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
                  <li className="text-lg my-[10px]  ml-[20px]">
                     - Này tui lấy của người ta nên hông biết &#128535; &#128535; &#128535;
                  </li>
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
               <ThemeItem active={active} key={index} theme={themeItem} onClick={handleSetTheme} />
            );

         lightTheme.push(
            <ThemeItem active={active} key={index} theme={themeItem} onClick={handleSetTheme} />
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
            setOpenModal: closeModal,
            className: "w-[auto]",
         }),
      [theme]
   );

   return (
      <>
         <PopupWrapper theme={theme}>
            <ul className="flex flex-col gap-[12px]">
               <li className="flex" onClick={() => handleSetComp("theme")}>
                  <PaintBrushIcon className="w-6 h-6 mr-2" />
                  Themes
               </li>
               {loggedIn && (
                  <li className="flex" onClick={() => handleSetComp("logout")}>
                     <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
                     Log out
                  </li>
               )}
               <li className="flex" onClick={() => handleSetComp("info")}>
                  <InformationCircleIcon className="w-6 h-6 mr-2" />
                  Info
               </li>
            </ul>
         </PopupWrapper>

         {isOpenModal && (
            <Modal setOpenModal={closeModal}>
               <PopupWrapper theme={theme}>
                  {modalName.current === "info" && infoScreen}
                  {modalName.current === "theme" && themesScreen}
                  {modalName.current === "confirm" && logoutModal}
               </PopupWrapper>
            </Modal>
         )}
      </>
   );
}

import {
   ArrowRightOnRectangleIcon,
   InformationCircleIcon,
   PaintBrushIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { Dispatch, ReactNode, useCallback, useMemo } from "react";
import { useTheme } from "../store/ThemeContext";
import { ThemeKeyType } from "../types";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import PopupWrapper from "./ui/PopupWrapper";
import { initialState, useAuthStore } from "../store/AuthContext";
import { useSongsStore } from "../store/SongsContext";
import { confirmModal } from "./Modal";
// import useLocalStorage from "../hooks/useLocalStorage";

type Props = {
   setSettingComp: Dispatch<React.SetStateAction<ReactNode>>;
   setIsOpenMenu: Dispatch<React.SetStateAction<boolean>>;
   setIsOpenSetting: Dispatch<React.SetStateAction<boolean>>;
   loggedIn: boolean;
};

export default function SettingMenu({
   setIsOpenSetting,
   setSettingComp,
   setIsOpenMenu,
   loggedIn,
}: Props) {
   // use stores
   const { theme, setTheme } = useTheme();
   const { setUserInfo } = useAuthStore();
   const { initSongsContext, adminSongs, adminPlaylists } = useSongsStore();

   const handleSetTheme = useCallback((theme: ThemeKeyType) => {
      localStorage.setItem("theme", JSON.stringify(theme));
      setTheme(theme);
   }, []);

   const renderHeader = (title: string) => {
      return (
         <div className="flex justify-between py-[15px]">
            <h1 className="text-xl font-bold">{title}</h1>
            <Button onClick={() => setIsOpenSetting(false)} size={"normal"} variant={"circle"}>
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
         initSongsContext({adminSongs, adminPlaylists});

         setIsOpenSetting(false);
      } catch (error) {
         console.log("signOut error", { messsage: error });
      }
   };

   const handleSetComp = (name: string) => {
      setIsOpenMenu(false);
      setIsOpenSetting(true);

      let comp;
      switch (name) {
         case "themes":
            comp = themesScreen;
            break;
         case "info":
            comp = infoScreen;
            break;
         case "logout":
            comp = logoutModal;
            break
         default:
            comp = <h1>Nothing to show</h1>;
      }

      setSettingComp(comp);
   };

   const infoScreen = (
      <div className="w-[700px] max-w-[90vw] max-[549px]:w-[85vw]">
         {renderHeader("Zingmp3 clone")}
         <div className="">
            <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
            <ul>
               {/* <li className="text-lg my-[10px] ml-[20px]">- React - Vite</li>
               <li className="text-lg my-[10px]  ml-[20px]">- Tailwind css</li> */}
               <li className="text-lg my-[10px]  ml-[20px]">
                  - Này tui copy nên không biết &#128535; &#128535; &#128535;
               </li>
            </ul>
            <a href="asldj" target="_blank" className="text-lg font-bold">
               #Github
            </a>
         </div>
      </div>
   );

   const themesScreen = useMemo(() => (
      <div className="w-[700px] max-w-[90vw] max-[549px]:w-[85vw]">
         {renderHeader("Themes")}
         <div className="overflow-auto no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]">
            <h2 className="text-md font-semibold mb-[10px]">Dark</h2>
            <div className="flex flex-row -mx-[10px] flex-wrap gap-y-[20px]">
               <div className="w-[25%] px-[10px] max-[549px]:w-[50%]">
                  <div
                     onClick={() => handleSetTheme("red")}
                     className={`from-[30%]  pt-[100%] rounded-xl bg-[#3b1113]`}
                  ></div>
                  <span className="text-sm">Đỏ</span>
               </div>
               <div className="w-[25%] px-[10px] max-[549px]:w-[50%]">
                  <div
                     onClick={() => handleSetTheme("deep_blue")}
                     className={`from-[30%]  pt-[100%] rounded-xl bg-[#111f3b]`}
                  ></div>
                  <span className="text-sm">Xanh đậm</span>
               </div>
            </div>

            <h2 className="text-md font-semibold mb-[10px] mt-[30px]">Light</h2>
            <div className="flex flex-row -mx-[10px] flex-wrap gap-y-[20px]">
               <div className="w-[25%] px-[10px] max-[549px]:w-[50%]">
                  <div
                     onClick={() => handleSetTheme("green_light")}
                     className="from-[30%] bg-[#c0d8d8]  pt-[100%] rounded-xl"
                  ></div>
                  <span className="text-sm">Xanh nhạt</span>
               </div>
            </div>
         </div>
      </div>
   ), []);

   const logoutModal = useMemo(
      () =>
         confirmModal({
            loading: false,
            label: "Log out ?",
            theme: theme,
            callback: handleSignOut,
            setOpenModal: setIsOpenSetting,
            className: "w-[auto]",
         }),
      [theme]
   );

   return (
      <>
         <PopupWrapper theme={theme} classNames="flex flex-col gap-[15px]">
            <Button onClick={() => handleSetComp("themes")}>
               <PaintBrushIcon className="w-6 h-6 mr-2" />
               Themes
            </Button>
            {loggedIn && (
               <Button onClick={() => handleSetComp("logout")}>
                  <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
                  Log out
               </Button>
            )}
            <Button onClick={() => handleSetComp("info")}>
               <InformationCircleIcon className="w-6 h-6 mr-2" />
               Info
            </Button>
         </PopupWrapper>
      </>
   );
}

import {
   ArrowRightOnRectangleIcon,
   InformationCircleIcon,
   // MusicalNoteIcon,
   PaintBrushIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { Dispatch, ReactNode } from "react";
import { useTheme } from "../store/ThemeContext";
import { ThemeKeyType } from "../types";
import { User, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import PopupWrapper from "./ui/PopupWrapper";
// import useLocalStorage from "../hooks/useLocalStorage";

type Props = {
   setSettingComp: Dispatch<React.SetStateAction<ReactNode>>;
   setIsOpenMenu: Dispatch<React.SetStateAction<boolean>>;
   setIsOpenSetting: Dispatch<React.SetStateAction<boolean>>;
   loggedInUser?: User | null | undefined;
};

export default function SettingMenu({
   setIsOpenSetting,
   setSettingComp,
   setIsOpenMenu,
   loggedInUser,
}: Props) {
   const { theme, setTheme } = useTheme();

   const handleSetTheme = (theme: ThemeKeyType) => {
      localStorage.setItem("theme", JSON.stringify(theme));
      setTheme(theme);
   };

   const renderHeader = (title: string) => {
      return (
         <div className="flex justify-between py-[15px]">
            <h1 className="text-xl font-bold">{title}</h1>
            <Button
               onClick={() => setIsOpenSetting(false)}
               size={"normal"}
               variant={"circle"}
            >
               <XMarkIcon />
            </Button>
         </div>
      );
   };

   const infoScreen = (
      <>
         {renderHeader("Zingmp3 clone")}
         <div className="">
            <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
            <ul>
               <li className="text-lg my-[10px] ml-[20px]">- React - Vite</li>
               <li className="text-lg my-[10px]  ml-[20px]">- Tailwind css</li>
            </ul>
            <a href="asldj" target="_blank" className="text-lg font-bold">
               #Github
            </a>
         </div>
      </>
   );

   const themesScreen = (
      <>
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
      </>
   );

   const handleSignOut = async () => {
      try {
         await signOut(auth);
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

         default:
            comp = <h1>Nothing to show</h1>;
      }

      setSettingComp(comp);
   };

   return (
      <PopupWrapper theme={theme}>
         <Button onClick={() => handleSetComp("themes")}>
            <PaintBrushIcon className="w-6 h-6 mr-2" />
            Themes
         </Button>
         {loggedInUser && (
            <Button onClick={() => handleSignOut()}>
               <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
               Log out
            </Button>
         )}
         <Button onClick={() => handleSetComp("info")}>
            <InformationCircleIcon className="w-6 h-6 mr-2" />
            Info
         </Button>
      </PopupWrapper>
   );
}

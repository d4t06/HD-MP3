import { Dispatch, SetStateAction } from "react";
import { themes } from "../../config/themes";
import { useTheme } from "../../store";
import ThemeItem from "../child/ThemeItem";
import ModalHeader from "./ModalHeader";
import { ThemeType } from "../../types";

export default function Appearance({
   setIsOpenModal,
}: {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
   const { theme: themeInStore, setTheme } = useTheme();

   const handleSetTheme = (theme: ThemeType) => {
      localStorage.setItem("theme", JSON.stringify(theme.id));
      setTheme(theme);
   };

   // define styles
   const classes = {
      songItemContainer: `w-full border-b border-${themeInStore.alpha} last:border-none`,
      icon: `w-6 h-6 mr-2 inline`,
      popupWrapper: "w-[900px] max-w-[calc(90vw-40px)]",
      themeContainer: "overflow-y-auto overflow-x-hidden no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
      themeList: "flex flex-row -mx-[10px] flex-wrap",
      linkItem: `py-[10px] border-b border-${themeInStore.alpha} last:border-none`,
   };

   const lightThemes = themes.map((t) => {
      const active = t.id === themeInStore.id;
      if (t.type === "light") {
         return (
            <ThemeItem active={active} key={t.id} theme={t} onClick={handleSetTheme} />
         );
      }
   });

   const darkThemes = themes.map((t) => {
      const active = t.id === themeInStore.id;
      if (t.type === "dark")
         return (
            <ThemeItem active={active} key={t.id} theme={t} onClick={handleSetTheme} />
         );
   });

   return (
      <div className={classes.popupWrapper}>
         <ModalHeader setIsOpenModal={setIsOpenModal} title="Themes" />
         <div className={classes.themeContainer}>
            <h2 className="text-md font-semibold mb-[10px]">Dark</h2>
            <div className={classes.themeList}>{darkThemes}</div>

            <h2 className="text-md font-semibold mb-[10px] mt-[30px]">Light</h2>
            <div className={classes.themeList}>{lightThemes}</div>
         </div>
      </div>
   );
}

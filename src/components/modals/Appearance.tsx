import { specialThemes, themes } from "@/constants/themes";
import { useThemeContext } from "@/stores";
import ThemeItem from "../child/ThemeItem";
import ModalHeader from "../ModalHeader";
import { setLocalStorage } from "@/utils/appHelpers";
export default function Appearance({ close }: { close: () => void }) {
  const { theme: themeInStore, setTheme } = useThemeContext();

  const handleSetTheme = (theme: ThemeType) => {
    setLocalStorage("theme", theme.id);
    setTheme(theme);
  };

  // define styles
  const classes = {
    songItemContainer: `w-full border-b border-${themeInStore.alpha} last:border-none`,
    icon: `w-6 h-6 mr-2 inline`,
    popupWrapper: "w-[900px] max-w-[calc(90vw-40px)]",
    themeContainer:
      "overflow-y-auto overflow-x-hidden no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
    themeList: "flex flex-row -mx-2 -mt-3 flex-wrap",
    linkItem: `py-[10px] border-b border-${themeInStore.alpha} last:border-none`,
  };

  const lightThemes = themes.map((t) => {
    const active = t.id === themeInStore.id;
    if (t.type === "light") {
      return <ThemeItem active={active} key={t.id} theme={t} onClick={handleSetTheme} />;
    }
  });

  const darkThemes = themes.map((t) => {
    const active = t.id === themeInStore.id;
    if (t.type === "dark")
      return <ThemeItem active={active} key={t.id} theme={t} onClick={handleSetTheme} />;
  });

  const _specialThemes = specialThemes.map((t) => {
    const active = t.id === themeInStore.id;
    return <ThemeItem active={active} key={t.id} theme={t} onClick={handleSetTheme} />;
  });

  return (
    <div className={classes.popupWrapper}>
      <ModalHeader close={close} title="Themes" />
      <div className={classes.themeContainer}>
        <h2 className="text-lg font-semibold mb-[10px] mt-[30px]">Specical</h2>
        <div className={classes.themeList}>{_specialThemes}</div>

        <h2 className="text-lg font-semibold mb-[10px]">Dark</h2>
        <div className={classes.themeList}>{darkThemes}</div>

        <h2 className="text-lg font-semibold mb-[10px] mt-[30px]">Light</h2>
        <div className={classes.themeList}>{lightThemes}</div>
      </div>
    </div>
  );
}

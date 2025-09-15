import { specialThemes, themes } from "@/constants/themes";
import { useThemeContext } from "@/stores";
import { ModalContentWrapper, ModalHeader } from ".";
import { setLocalStorage } from "@/utils/appHelpers";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Title } from "..";

type Props = {
  theme: ThemeType;
  onClick: (theme: ThemeType) => void;
  active: boolean;
};

function ThemeItem({ onClick, theme, active }: Props) {
  return (
    <>
      <div className="w-[25%] px-2 mt-3 max-[549px]:w-[50%]">
        <div
          onClick={() => onClick(theme)}
          className={`relative popup-shadow border-l-[20px] ${theme.container} ${theme.border}  pt-[100%] rounded-xl`}
        >
          {active && (
            <div className="absolute bottom-[10px] right-[10px]">
              <CheckCircleIcon className={`w-[25px]`} />
            </div>
          )}
        </div>
        <p className="text-base font-[500] mt-1">{theme.name}</p>
      </div>
    </>
  );
}

export default function Appearance({ closeModal }: { closeModal: () => void }) {
  const { theme, setTheme } = useThemeContext();

  const handleSetTheme = (theme: ThemeType) => {
    setLocalStorage("theme", theme.id);
    setTheme(theme);
  };

  // define styles
  const classes = {
    themeContainer: "overflow-y-auto overflow-x-hidden flex-grow space-y-5 pb-[5vh]",
    themeList: "flex flex-row -mx-2 -mt-3 flex-wrap",
  };

  const lightThemes = themes.map((t) => {
    const active = t.id === theme.id;
    if (t.type === "light") {
      return (
        <ThemeItem
          active={active}
          key={t.id}
          theme={t}
          onClick={handleSetTheme}
        />
      );
    }
  });

  const darkThemes = themes.map((t) => {
    const active = t.id === theme.id;
    if (t.type === "dark")
      return (
        <ThemeItem
          active={active}
          key={t.id}
          theme={t}
          onClick={handleSetTheme}
        />
      );
  });

  const _specialThemes = specialThemes.map((t) => {
    const active = t.id === theme.id;
    return (
      <ThemeItem
        active={active}
        key={t.id}
        theme={t}
        onClick={handleSetTheme}
      />
    );
  });

  return (
    <ModalContentWrapper className="w-[900px]">
      <ModalHeader closeModal={closeModal} title="Themes" />
      <div className={classes.themeContainer}>
        <div>
          <Title variant={"h2"} className="mb-3" title="Specical" />
          <div className={classes.themeList}>{_specialThemes}</div>
        </div>

        <div>
          <Title variant={"h2"} className="mb-3" title="Dark" />
          <div className={classes.themeList}>{darkThemes}</div>
        </div>

        <div>
          <Title variant={"h2"} className="mb-3" title="Light" />
          <div className={classes.themeList}>{lightThemes}</div>
        </div>
      </div>
    </ModalContentWrapper>
  );
}

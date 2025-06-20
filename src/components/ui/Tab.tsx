import { useThemeContext } from "@/stores";
import { Button } from "..";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props<T> = {
  setTab: Dispatch<SetStateAction<T>>;
  tab: T;
  tabs: readonly T[];
  disable?: boolean;
  render: (item: T) => ReactNode;
  className?: string;
};

export default function Tab<T>({
  setTab,
  render,
  disable,
  tab,
  tabs,
  className = "",
}: Props<T>) {
  const { theme } = useThemeContext();

  const classes = {
    inActiveTab: ` hover:bg-${theme.alpha}`,
    activeTab: `${theme.content_bg}`,
  };

  return (
    <div
      className={`bg-${theme.alpha} ${disable ? "disable" : ""} p-1.5 space-x-1 rounded-full ${className}`}
    >
      {tabs.map((t, i) => (
        <Button
          size={"clear"}
          key={i}
          onClick={(e) => {
            setTab(t);
            (e.target as HTMLButtonElement).blur();
          }}
          className={`py-1 px-4 ${t === tab ? classes.activeTab : classes.inActiveTab}`}
        >
          {render(t)}
        </Button>
      ))}
    </div>
  );
}

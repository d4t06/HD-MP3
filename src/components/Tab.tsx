import { useThemeContext } from "@/stores";
import { Button } from ".";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props<T> = {
  setTab: Dispatch<SetStateAction<T>>;
  tab: T;
  tabs: readonly T[];
  render: (item: T) => ReactNode;
};

export default function Tab<T>({ setTab, render, tab, tabs }: Props<T>) {
  const { theme } = useThemeContext();

  const classes = {
    inActiveTab: `border border-${theme.alpha} bg-transparent`,
    activeTab: `${theme.content_bg}`,
  };

  return tabs.map((t, i) => (
    <Button
      key={i}
      onClick={() => setTab(t)}
      className={`${t === tab ? classes.activeTab : classes.inActiveTab}`}
    >
      {render(t)}
    </Button>
  ));
}

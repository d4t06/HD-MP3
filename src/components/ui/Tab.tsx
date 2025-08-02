import { Button } from "..";
import { ReactNode } from "react";

type Props<T> = {
  setTab: (v:T) => void;
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

  const classes = {
    inActiveTab: ` hover:bg-[--a-5-cl]`,
    activeTab: `bg-[--primary-cl] text-white`,
  };

  return (
    <div
      className={`bg-[--a-5-cl] ${disable ? "disable" : ""} p-1.5 space-x-1 rounded-full ${className}`}
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

import { usePlayerContext } from "@/stores";
// generic

type Props = {
  variant?: "mobile" | "desktop";
};

export default function FullScreenPlayerTab({ variant = "desktop" }: Props) {
  const {
    desktopTabs,
    activeTab,
    setActiveTab,
    mobileActiveTab,
    mobileTabs,
    setMobileActiveTab,
    idle,
  } = usePlayerContext();

  const tab = variant === "desktop" ? activeTab : mobileActiveTab;
  const setTab = variant === "desktop" ? setActiveTab : setMobileActiveTab;
  const tabs = variant === "desktop" ? desktopTabs : mobileTabs;

  const classes = {
    item: "px-3 md:px-8 leading-[30px] font-bold cursor-pointer  rounded-full",
    fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
  };

  return (
    <ul
      className={`inline-flex mx-auto rounded-full space-x-1 bg-white/10 p-1 ${idle ? classes.fadeTransition : ""}`}
    >
      {tabs.map((item, index) => {
        const isActive = item === tab;

        return (
          <li
            key={index}
            // @ts-ignore
            onClick={() => setTab(item)}
            className={`${classes.item} ${isActive ? "bg-white/20" : "hover:bg-white/5"}`}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
}

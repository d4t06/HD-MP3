import { Dispatch, ReactNode, SetStateAction } from "react";
import { useTheme } from "../store";

type Props<T> = {
  setActiveTab: Dispatch<SetStateAction<T>>;
  activeTab: T;
  tabs: T[];
  className?: string;
  render: (item: T) => ReactNode;
  inFullScreen?: boolean;
};

// generic
function Tabs<T>({
  tabs,
  activeTab,
  setActiveTab,
  className,
  render,
  inFullScreen,
}: Props<T>) {
  const { theme } = useTheme();
  return (
    <ul
      className={`flex space-x-[4px] py-[4px] h-full px-[4px] items-center ${
        inFullScreen ? "mx-auto" : ""
      } rounded-full ${inFullScreen ? "bg-white/10" : theme.side_bar_bg} ${
        className && className
      }`}
    >
      {tabs.map((item, index) => (
        <li
          key={index}
          onClick={() => setActiveTab(item)}
          className={`${
            inFullScreen ? "px-[30px]" : "px-[20px]"
          }  cursor-pointer hover:bg-white/20 h-full rounded-full max-[549px]:px-4 ${
            inFullScreen ? "" : theme.content_hover_text
          } ${
            activeTab === item
              ? inFullScreen
                ? "bg-white/20"
                : `${theme.content_text} ${theme.container}`
              : "opacity-60"
          }`}
        >
          <span className="leading-[30px] font-normal sm:font-bold">
            {render(item)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default Tabs;

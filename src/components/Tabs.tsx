import { Dispatch, ReactNode, SetStateAction } from "react";
import { useTheme } from "../store";

type Props<T> = {
   setActiveTab: Dispatch<SetStateAction<T>>;
   activeTab: T;
   tabs: T[];
   className?: string;
   render: (item: T) => ReactNode;
   inFullScreen?: boolean
};

// generic
function Tabs<T>({ tabs, activeTab, setActiveTab, className, render, inFullScreen }: Props<T>) {
   const { theme } = useTheme();
   return (
      <ul
         className={`flex py-[4px] h-full px-[4px] items-center ${inFullScreen ? 'mx-auto' : ''} rounded-full ${
            inFullScreen ? 'bg-gray-500 bg-opacity-[.2]' : theme.side_bar_bg
         } ${className && className}`}
      >
         {tabs.map((item, index) => (
            <li
               key={index}
               onClick={() => setActiveTab(item)}
               className={`${inFullScreen ? 'px-[30px]' : 'px-[20px]'}  cursor-pointer h-full rounded-full max-[549px]:px-[15px] ${inFullScreen ? '' : theme.content_hover_text} ${
                  activeTab === item ? inFullScreen ? 'bg-gray-400 bg-opacity-[.2]' : `${theme.content_text} ${theme.container} ` : "" 
               }`}
            >
               <span className="leading-[27px] font-[500] max-[549px]:font-normal">
                  {render(item)}
               </span>
            </li>
         ))}
      </ul>
   );
}

export default Tabs;

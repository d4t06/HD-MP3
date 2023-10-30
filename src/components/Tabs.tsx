import { Dispatch, FC, SetStateAction } from "react";

type Props = {
   setActiveTab: Dispatch<SetStateAction<string>>;
   activeTab: string;
   tabs: string[];
   className?: string;
};

const Tabs: FC<Props> = ({ tabs, activeTab, setActiveTab, className }) => {
   return (
      <ul
         className={
            `flex py-[4px] h-full px-[4px] items-center mx-auto rounded-full bg-gray-500 bg-opacity-20 ${className && className}` 
         }
      >
         {tabs.map((item, index) => {
            return (
               <li
                  key={index}
                  onClick={() => setActiveTab(item)}
                  className={`px-[30px] h-full rounded-full max-[549px]:px-[15px] ${
                     activeTab === item ? "bg-gray-400 bg-opacity-20 text-white" : ""
                  }`}
               >
                  <span className="leading-[27px] font-bold max-[549px]:font-normal">
                     {item}
                  </span>
               </li>
            );
         })}
      </ul>
   );
};

export default Tabs;

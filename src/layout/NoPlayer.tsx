import { FC, ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../store/ThemeContext";
import Auth from "../components/Auth";

interface Props {
   children: ReactNode;
}

const NoPlayer: FC<Props> = ({ children }) => {
   const { theme } = useTheme();

   return (
      <Auth>
         <div
            className={`h-screen w-screen flex 
         ${theme.type === "dark" ? "text-white" : "text-[#333]"}
         ${theme.container}
         `}
         >
            <Sidebar />
            <div className="w-full overflow-auto h-[calc(100vh-90px)]">
               <div className="px-[40px] max-[549px]:px-[10px]">{children}</div>
            </div>
         </div>
      </Auth>
   );
};
export default NoPlayer;

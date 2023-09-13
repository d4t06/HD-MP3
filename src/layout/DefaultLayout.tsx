import { FC, ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { useTheme } from "../store/ThemeContext";
import Auth from "../components/Auth";

interface Props {
   children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
   const { theme } = useTheme();
   // const {color, type} = theme

   // console.log("check theme", theme);

   return (
      <Auth>
         <div
            className={`h-screen w-screen flex 
         ${theme.type === "dark" ? "text-white" : "text-[#333]"}
         ${theme.container}
         `}
         >
            {window.innerWidth >= 550 && <Sidebar />}
            <div className="w-full overflow-y-auto overflow-x-hidden h-[calc(100vh-90px)] max-[549px]:h-full">
               <div
                  // style={{
                  //    backgroundImage: `linear-gradient(to bottom, #cd1818 10%, 90%)`,
                  // }}
                  className={`h-[200px]`}
               ></div>
               <div className="px-[40px] max-[549px]:px-[15px]">{children}</div>
            </div>

            <Player />
         </div>
      </Auth>
   );
};
export default DefaultLayout;

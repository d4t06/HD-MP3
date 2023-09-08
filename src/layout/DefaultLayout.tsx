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
            <Sidebar />
            <div className="w-full overflow-auto h-[calc(100vh-90px)]">
               <div
                  // style={{
                  //    backgroundImage: `linear-gradient(to bottom, #cd1818 10%, 90%)`,
                  // }}
                  className={`h-[200px]`}
               ></div>
               <div className="px-[40px] max-[549px]:px-[10px]">{children}</div>
            </div>

            {/* <Player /> */}
         </div>
      </Auth>
   );
};
export default DefaultLayout;

import { FC, ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";

interface Props {
   children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
   return (
      <div className="h-screen w-screen bg-black flex">
         <Sidebar />
         <div className="w-full overflow-auto h-[calc(100vh-90px)]">
            <div className="h-[15rem] bg-gradient-to-b from-indigo-600 to-black w-full"></div>
            <div className="px-[40px]">{children}</div>
         </div>
         
         <Player />
      </div>
   );
};

export default Layout;

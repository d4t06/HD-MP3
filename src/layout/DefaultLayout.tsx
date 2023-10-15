import { FC, ReactNode } from "react";
import { useTheme } from "../store/ThemeContext";
import { Sidebar, Player, Auth, ToastPortal } from "../components";

interface Props {
   children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
   const { theme } = useTheme();

   const classes = {
      container:
         "w-full overflow-y-auto overflow-x-hidden h-[calc(100vh-90px)] max-[549px]:h-full max-[549px]:pb-[70px]",
      content: "px-[40px] max-[549px]:px-[15px]",
      page: `min-h-screen flex ${theme.type === "dark" ? "text-white" : "text-[#333]"} ${
         theme.container
      }`,
   };

   return (
      <Auth>
         <div className={classes.page}>
            {window.innerWidth >= 550 && <Sidebar />}
            <div className={classes.container}>
               <div className={`h-[200px]`}></div>
               <div className={classes.content}>{children}</div>
            </div>

            <Player />
            <ToastPortal autoClose />
         </div>
      </Auth>
   );
};
export default DefaultLayout;

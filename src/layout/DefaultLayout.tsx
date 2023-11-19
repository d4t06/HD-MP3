import { FC, ReactNode, useMemo } from "react";
import { useTheme } from "../store/ThemeContext";
import { Sidebar, Player, UploadSongPortal } from "../components";
import { useLocation } from "react-router-dom";
import BackBtn from "../components/BackBtn";

interface Props {
   children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
   const { theme } = useTheme();
   const location = useLocation();

   const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

   const classes = {
      container: `w-full overflow-y-auto overflow-x-hidden ${
         inEdit ? "h-[100vh]" : "h-[calc(100vh)] pb-[90px]"
      } max-[549px]:h-full max-[549px]:pb-[70px]`,
      content: "px-[40px] max-[549px]:px-[15px]",
      page: `min-h-screen flex overflow-hidden ${
         theme.type === "dark" ? "text-white" : "text-[#333]"
      } ${theme.container}`,
   };

   return (
      <div className={classes.page}>
         {window.innerWidth >= 800 && <Sidebar />}
         <div className={classes.container}>
            <div className={`h-[100px]`}></div>

            <div className={classes.content}>
               <>
                  {/* <BackBtn /> */}
                  {children}
               </>
            </div>
         </div>

         <Player />

         <UploadSongPortal />
      </div>
   );
};
export default DefaultLayout;

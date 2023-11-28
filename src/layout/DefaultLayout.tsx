import { FC, ReactNode, useMemo, useRef } from "react";
import { useTheme } from "../store/ThemeContext";
import { Sidebar, Player, UploadSongPortal, Header } from "../components";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

interface Props {
   children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
   const { theme } = useTheme();
   const location = useLocation();

   const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

   const contentRef = useRef<HTMLDivElement>(null);

   const classes = {
      container: `w-full overflow-auto ${
         inEdit ? "h-[100vh]" : "h-[calc(100vh)] pb-[90px]"
      } max-[549px]:h-full max-[549px]:pb-[70px]`,
      content: "px-[40px] max-[549px]:px-[15px] mt-[60px]",
      page: `min-h-screen flex ${theme.type === "dark" ? "text-white" : "text-[#333]"} ${
         theme.container
      }`,
   };

   return (
      <div className={classes.page}>
         {window.innerWidth >= 800 && <Sidebar />}

         <div ref={contentRef} className={classes.container}>
            {window.innerWidth >= 800 && <Header contentRef={contentRef} />}
            <div className={classes.content}>
               {children}

              

               <Footer />
            </div>
         </div>

         <Player />
         <UploadSongPortal />
      </div>
   );
};
export default DefaultLayout;

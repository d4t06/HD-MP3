import { FC, ReactNode, useMemo, useRef } from "react";
import { useTheme } from "../store/ThemeContext";
import { Sidebar, Player, UploadSongPortal, Header } from "../components";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

interface Props {
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = {
    container: ` main-container overflow-auto no-scrollbar main-content w-full ${
      inEdit ? "" : "min-h-[100vh] pb-[90px]"
    } max-[549px]:h-full `,
    content: "px-[40px] max-[549px]:px-[15px] mt-[60px]",
    page: `flex h-[100vh] overflow-hidden ${
      theme.type === "dark" ? "text-white" : "text-[#333]"
    } ${theme.container}`,
  };

  return (
    <>
      <div className={classes.page}>
        {window.innerWidth >= 800 && <Sidebar />}

        <div ref={containerRef} className={classes.container}>
          {window.innerWidth >= 800 && <Header contentRef={containerRef} />}
          <div className={classes.content}>
            {children}

            <Footer />
          </div>
        </div>
        <Player />
        <ScrollTop containerRef={containerRef} />
      </div>

      <UploadSongPortal />
    </>
  );
};
export default DefaultLayout;

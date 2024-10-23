import { FC, ReactNode, useEffect, useRef } from "react";
import { useTheme } from "@/store/ThemeContext";
import { Sidebar, Player, UploadSongPortal, Header } from "../components";

interface Props {
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = {
    page: ` ${theme.type === "dark" ? "text-white" : "text-[#333]"} ${theme.container}`,
    container: `w-full h-full  px-[10px] md:px-[40px] md:pt-[60px] overflow-auto no-scrollbar`,
  };

  useEffect(() => {
    const meta = document.querySelector(".my-tag");
    if (meta) {
      meta.setAttribute("content", theme.container_code);
    }
  }, [theme]);

  return (
    <>
      <div className={`flex h-screen sm:overflow-hidden ${classes.page}`}>
        {/* hidden in mobile */}
        <Sidebar />
        <div ref={containerRef} className={classes.container}>
          {/* hide in mobile */}
          <Header contentRef={containerRef} />
          {children}
        </div>
        <Player />
      </div>

      <UploadSongPortal />
    </>
  );
};
export default DefaultLayout;

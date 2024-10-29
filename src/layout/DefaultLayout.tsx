import { FC, ReactNode, useEffect, useRef } from "react";
import { useTheme } from "@/store/ThemeContext";
import { Header, Player, Sidebar, UploadSongPortal } from "../components";

interface Props {
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  const textColor = () => {
    switch (theme.type) {
      case "light":
        return "text-[#333]";
      case "dark":
        return "text-white";
    }
  };

  const classes = {
    page: `left-0 top-0 right-0 bottom-0 md:relative md:flex md:h-screen md:overflow-hidden ${textColor()}`,
    container: `h-full md:w-full px-[10px] md:px-[40px] pt-[60px] md:overflow-auto md:no-scrollbar`,
  };

  useEffect(() => {
    const meta = document.querySelector(".my-tag");
    const body = document.querySelector("body");

    if (meta) {
      meta.setAttribute("content", theme.container_code);
    }

    body!.style.backgroundColor = theme.container_code;
  }, [theme]);

  return (
    <>
      <div className={`${classes.page}`}>
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

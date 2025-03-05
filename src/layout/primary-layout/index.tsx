import { ReactNode, useEffect, useRef } from "react";
import Player from "./_components/Player";
import { useThemeContext } from "@/stores";
import Sidebar from "@/modules/sidebar";
import Header from "@/modules/header";
import ToastPortal from "@/modules/toast-portal";
import UploadSongPortal from "./_components/UploadSongPortal";

interface Props {
  children: ReactNode;
}

export default function PrimaryLayout({ children }: Props) {
  const { theme } = useThemeContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = {
    page: `md:flex md:h-screen md:overflow-hidden ${theme.container} ${theme.text_color}`,
    container: `h-full md:w-full px-[10px] md:px-[40px] pt-[30px] md:pt-[90px] md:pb-[90px] md:overflow-auto`,
  };

  useEffect(() => {
    const meta = document.querySelector(".my-tag");
    const body = document.querySelector("body");

    body!.style.backgroundColor = theme.container_code;
    if (meta) meta.setAttribute("content", theme.container_code);
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

      <ToastPortal variant="client" />

      <UploadSongPortal />
    </>
  );
}

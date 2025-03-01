import { FC, ReactNode, useEffect, useRef } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import Player from "./_components/Player";
import UploadSongPortal from "@/layout/_components/UploadSongPortal";
import ToastPortal from "./_components/ToastPortal";
import { useThemeContext } from "@/stores";

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

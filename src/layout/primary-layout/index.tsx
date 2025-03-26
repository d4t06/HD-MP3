import { useEffect, useRef } from "react";
import Player from "./_components/Player";
import { useThemeContext } from "@/stores";
import Sidebar from "@/modules/sidebar";
import Header from "@/modules/header";
import ToastPortal from "@/modules/toast-portal";
import UploadSongPortal from "@/modules/upload-song-portal/idnex";
import { Outlet } from "react-router-dom";
import NavigationProvider, {
  PushBrowserHistory,
} from "@/stores/global/NavigationContext";

export default function PrimaryLayout() {
  const { theme } = useThemeContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = {
    page: `md:flex md:h-screen md:overflow-hidden ${theme.container} ${theme.text_color}`,
    container: `h-full md:w-full md:flex md:flex-col px-[10px] md:px-[40px] pt-[30px] md:pt-[60px] md:overflow-auto`,
  };

  useEffect(() => {
    const meta = document.querySelector(".my-tag");
    const body = document.querySelector("body");

    body!.style.backgroundColor = theme.container_code;
    if (meta) meta.setAttribute("content", theme.container_code);
  }, [theme]);

  return (
    <>
      <NavigationProvider>
        <div className={`${classes.page}`}>
          {/* hidden in mobile */}
          <Sidebar />
          <div ref={containerRef} className={classes.container}>
            {/* hide in mobile */}
            <Header contentRef={containerRef} />
            <Outlet />
          </div>
          <Player />
        </div>

        <ToastPortal className="left-[50%] translate-x-[-50%] top-[10px] md:top-[unset] md:bottom-[100px] md:left-[20px] md:translate-x-0" />

        <UploadSongPortal />

        <PushBrowserHistory />
      </NavigationProvider>
    </>
  );
}

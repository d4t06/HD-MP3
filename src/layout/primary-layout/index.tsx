import { ReactNode, useEffect, useRef } from "react";
import Player from "./_components/Player";
import { useThemeContext } from "@/stores";
import Sidebar from "@/modules/sidebar";
import Header from "./_components/Header";
import ToastPortal from "@/modules/toast-portal";
import UploadSongPortal from "@/modules/upload-song-portal/idnex";
import { Outlet } from "react-router-dom";
import NavigationProvider, {
  PushBrowserHistory,
} from "@/stores/global/NavigationContext";
import PlayerProvider, { usePlayerContext } from "@/stores/PlayerContext";

type Props = {
  children: ReactNode;
};

function Content({ children }: Props) {
  const { theme, isOnMobile } = useThemeContext();
  const { isOpenFullScreen } = usePlayerContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = {
    page: `md:flex md:h-screen bg-[--layout-cl] text-[--text-cl] transition-[color]`,
    container: `main-container pt-5 overflow-x-hidden md:pt-0 md:h-full md:w-full md:flex md:flex-col px-[10px] md:px-[40px] md:pt-[60px] md:overflow-auto `,
  };

  useEffect(() => {
    const meta = document.querySelector(".my-tag");
    const body = document.querySelector("body");

    if (body) {
      body.setAttribute("data-theme", theme.id);
      if (theme.type === "dark") body.classList.add("dark");
      else body.classList.remove("dark");

      if (isOpenFullScreen) body.classList.add("full-screen");
      else body.classList.remove("full-screen");

      if (isOnMobile) {
        body.style.backgroundColor = "var(--layout-cl)";
      }
    }
    if (meta) meta.setAttribute("content", theme.container);
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      if (isOpenFullScreen) body.classList.add("full-screen");
      else body.classList.remove("full-screen");
    }
  }, [isOpenFullScreen]);

  return (
    <>
      <div className={`${classes.page}`}>
        {/* hidden in mobile */}
        {!isOnMobile && <Sidebar />}
        <div ref={containerRef} className={`${classes.container}`}>
          {/* hide in mobile */}
          {!isOnMobile && <Header contentRef={containerRef} />}
          {children}
        </div>
        <Player />
      </div>

      <ToastPortal className="left-[50%] translate-x-[-50%] top-[10px] md:top-[unset] md:bottom-[100px] md:left-[20px] md:translate-x-0" />

      <UploadSongPortal />

      {!isOnMobile && <PushBrowserHistory />}
    </>
  );
}

export default function PrimaryLayout() {
  return (
    <PlayerProvider>
      <NavigationProvider>
        <Content>
          <Outlet />
        </Content>
      </NavigationProvider>
    </PlayerProvider>
  );
}

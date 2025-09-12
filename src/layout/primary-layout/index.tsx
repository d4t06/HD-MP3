import { ReactNode, useRef } from "react";
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
import PlayerProvider from "@/stores/PlayerContext";
import usePrimayLayout from "./_hooks/usePrimaryLayout";

type Props = {
  children: ReactNode;
};

function Content({ children }: Props) {
  const { isOnMobile } = useThemeContext();

  const containerRef = useRef<HTMLDivElement>(null);

  usePrimayLayout();

  const classes = {
    page: `md:flex md:h-screen bg-[--layout-cl] text-[--text-cl] transition-[color]`,
    container: `main-container  pt-5 overflow-x-hidden md:pt-0 md:h-full md:w-full md:flex md:flex-col px-[10px] md:px-[40px] md:pt-[60px] md:overflow-auto `,
  };

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

import { useThemeContext } from "../stores";
// import { useInitSong } from "../hooks";
import { PlaylistList, HomeSongList } from "../components";
import { MobileNav, MobileSetting } from "@/components";
import useGetSongPlaylist from "@/hooks/useGetSongPlaylist";
// import { useEditForm } from "@/hooks";
import { useEffect, useRef } from "react";
import Footer from "@/layout/_components/Footer";

export default function HomePage() {
  // stores
  const { isOnMobile } = useThemeContext();

  const ranEffect = useRef(false);

  const { isFetching, getSongAndPlaylist } = useGetSongPlaylist();

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      getSongAndPlaylist({ variant: "home" });
    }
  }, []);

  return (
    <>
      {isOnMobile && <MobileNav />}
      <div className="mb-[30px]">
        <h3 className="text-xl leading-[2.2] font-playwriteCU mb-3">Popular</h3>

        <PlaylistList loading={isFetching} variant="sys" />
      </div>

      <HomeSongList loading={isFetching} />
      {isOnMobile && (
        <div className="mt-[30px]">
          <MobileSetting />
        </div>
      )}

      <Footer />
    </>
  );
}

// import useGetSongPlaylist from "@/hooks/useGetSongPlaylist"; // import { useEditForm } from "@/hooks";
// import { useThemeContext } from "@/stores";
// import { useEffect, useRef } from "react";
// import MobileNav from "./_components/MobileNav";
// import HomeSongList from "./_components/HomeSongList";
// import MobileSetting from "./_components/MobileSetting";
import Footer from "@/layout/primary-layout/_components/Footer";
import HomePlaylist from "./_components/HomePlaylist";
import HomeSongList from "./_components/HomeSongList";
// import { PlaylistList } from "@/components";

export default function HomePage() {
  // stores
  //   const { isOnMobile } = useThemeContext();

  //   const ranEffect = useRef(false);

  //   const { isFetching, getSongAndPlaylist, sysSongPlaylist } = useGetSongPlaylist();

  //   useEffect(() => {
  //     if (!ranEffect.current) {
  //       ranEffect.current = true;
  //       getSongAndPlaylist({ variant: "system" });
  //     }
  //   }, []);

  return (
    <>
      {/* {isOnMobile && <MobileNav />} */}

      <HomePlaylist />

      <HomeSongList />

      {/* <PlaylistList loading={isFetching} playlists={sysSongPlaylist.playlists} />

      <HomeSongList loading={isFetching} />
      {isOnMobile && (
        <div className="mt-[30px]">
          <MobileSetting />
        </div>
      )} */}

      <Footer />
    </>
  );
}

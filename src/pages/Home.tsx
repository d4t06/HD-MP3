import { useTheme } from "../store";
// import { useInitSong } from "../hooks";
import { PlaylistList, HomeSongList } from "../components";
import { MobileNav, MobileSetting } from "@/components";
import Footer from "@/components/Footer";
import useGetSongPlaylist from "@/hooks/useGetSongPlaylist";

export default function HomePage() {
  // store
  const { isOnMobile } = useTheme();

  const { isFetching } = useGetSongPlaylist({ variant: "sys" });

  // hooks
  //   const { loading: useSongLoading } = useInitSong({});

  return (
    <div className="pb-[80px]">
      {isOnMobile && <MobileNav />}
      <div className="pb-[30px]">
        <h3 className="text-xl leading-[2.2] font-playwriteCU mb-3">Popular</h3>

        <PlaylistList loading={isFetching} variant="sys" />
      </div>
      <HomeSongList loading={isFetching} />

      {isOnMobile && <MobileSetting />}

      <Footer />
    </div>
  );
}

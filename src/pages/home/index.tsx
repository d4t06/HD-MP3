
import Footer from "@/layout/primary-layout/_components/Footer";
import HomePlaylist from "./_components/HomePlaylist";
import HomeSongList from "./_components/HomeSongList";
import RecentPlaylist from "./_components/RecentPlaylist";
import MobileNav from "./_components/MobileNav";
import MobileSetting from "./_components/MobileSetting";


export default function HomePage() {

  return (
    <>
      <div className="space-y-5">
        <MobileNav />

        <RecentPlaylist />

        <HomePlaylist />

        <HomeSongList />

        <MobileSetting />
      </div>

      <Footer />
    </>
  );
}

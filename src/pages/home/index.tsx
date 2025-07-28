import Footer from "@/layout/primary-layout/_components/Footer";
// import HomePlaylist from "./_components/HomePlaylist";
// import HomeSongList from "./_components/HomeSongList";
import RecentPlaylist from "./_components/RecentPlaylist";
import MobileSetting from "./_components/MobileSetting";
import TrendingSong from "@/modules/trending-song";

export default function HomePage() {
  return (
    <>
      <div className="space-y-5 mt-10">
        <TrendingSong amount={3} />

        <RecentPlaylist />
        {/*<HomePlaylist />

        <HomeSongList />
*/}

        <MobileSetting />
      </div>
      <Footer />
    </>
  );
}

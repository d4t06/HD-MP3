import useGetSinger from "./_hooks/useGetSinger";
import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerPlaylist from "./_components/SingerPlaylist";
import Footer from "@/layout/primary-layout/_components/Footer";

export default function DashboardEditSingerPage() {
  useGetSinger();

  return (
    <>
      <div className="mt-3 space-y-3">
        <SingerInfo />
        <SingerSongList />
        <SingerPlaylist />
      </div>

      <Footer />
    </>
  );
}

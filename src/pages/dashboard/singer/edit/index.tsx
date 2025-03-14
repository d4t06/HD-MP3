import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerPlaylist from "./_components/SingerPlaylist";
import Footer from "@/layout/primary-layout/_components/Footer";
import GetSingerProvider from "./_components/GetSingerContext";

function Content() {
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

export default function DashboardEditSingerPage() {
  return (
    <GetSingerProvider>
      <Content />
    </GetSingerProvider>
  );
}

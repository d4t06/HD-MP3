import useGetSinger from "./_hooks/useGetSinger";
import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerProvider from "./_components/SingerContext";
import SingerPlaylist from "./_components/SingerPlaylist";
import Footer from "@/layout/primary-layout/_components/Footer";

function Content() {
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

export default function SingerPage() {
  return (
    <SingerProvider>
      <Content />
    </SingerProvider>
  );
}

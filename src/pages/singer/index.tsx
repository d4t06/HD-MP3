import useGetSinger from "./_hooks/useGetSinger";
import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerProvider from "./_components/SingerContext";
import SingerPlaylist from "./_components/SingerPlaylist";
import Footer from "@/layout/primary-layout/_components/Footer";
import BackBtn from "@/components/BackBtn";

function Content() {
  useGetSinger();

  return (
    <>
      <div className="space-y-5">
        <BackBtn />
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

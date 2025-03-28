import useGetSinger from "./_hooks/useGetSinger";
import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerProvider from "./_components/SingerContext";
import SingerPlaylist from "./_components/SingerPlaylist";
import Footer from "@/layout/primary-layout/_components/Footer";
import BackBtn from "@/components/BackBtn";
import { Center, NotFound } from "@/components";

function Content() {
  const { isFetching, singer } = useGetSinger();

  if (!isFetching && !singer)
    return (
      <Center>
        <NotFound variant="with-home-button" />
      </Center>
    );

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

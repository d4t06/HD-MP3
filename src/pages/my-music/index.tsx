import Footer from "@/layout/primary-layout/_components/Footer";
import { Loading, Center, PageWrapper } from "@/components";
import SingerSection from "./_components/SingerSection";
import useMySongPage from "./_hooks/useMySongPage";
import MyMusicPlaylistSection from "./_components/PlaylistSection";
import SongSection from "./_components/SongSectiont";

function Content() {
  return (
    <>
      <PageWrapper>
        <MyMusicPlaylistSection />
        <SingerSection />
        <SongSection />
      </PageWrapper>
      <Footer />
    </>
  );
}

export default function MyMusicPage() {
  const { isFetching } = useMySongPage();

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  return <Content />;
}

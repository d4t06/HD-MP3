import Footer from "@/layout/primary-layout/_components/Footer";
import SongTable from "./_components/SongTable";
import TrendingSong from "@/modules/trending-song";
import { PageWrapper } from "@/components";

export default function Trending() {
  return (
    <>
      <PageWrapper>
        <TrendingSong amount={10} />
        <SongTable />
      </PageWrapper>
      <Footer />
    </>
  );
}

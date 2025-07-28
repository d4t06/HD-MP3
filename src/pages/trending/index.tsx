import Footer from "@/layout/primary-layout/_components/Footer";
import SongTable from "./_components/SongTable";
import TrendingSong from "@/modules/trending-song";

export default function Trending() {
  return (
    <>
      <div className="space-y-5 mt-10">
        <TrendingSong amount={10} />
        <SongTable />
      </div>

      <Footer />
    </>
  );
}

import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerPlaylist from "./_components/SingerPlaylist";
import GetSingerProvider from "./_components/GetSingerContext";

function Content() {
  return (
    <>
      <div className="pt-3 pb-[46px] space-y-3">
        <SingerInfo />
        <SingerSongList />
        <SingerPlaylist />
      </div>
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

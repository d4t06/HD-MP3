import SingerInfo from "./_components/SingerInfo";
import SingerSongList from "./_components/SingerSongList";
import SingerPlaylist from "./_components/SingerPlaylist";
import GetSingerProvider from "./_components/GetSingerContext";
import SingerAlbum from "./_components/SingerAlbum";

function Content() {
  return (
    <>
      <div className="pb-[46px] space-y-5">
        <SingerInfo />
        <SingerAlbum />
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

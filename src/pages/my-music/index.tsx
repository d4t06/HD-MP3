import Footer from "@/layout/primary-layout/_components/Footer";
import { Title, Tab, Loading, Center, PageWrapper } from "@/components";
import { useState } from "react";
import FavoriteSongList from "./_components/FavoriteSong";
import UploadedSongList from "./_components/UploadedSong";
import MyMusicPlaylistList from "./_components/PlaylistList";
import SingerSection from "./_components/SingerSection";
import useMySongPage from "./_hooks/useMySongPage";

const tabs = ["Favorite", "Uploaded"] as const;
type Tab = (typeof tabs)[number];

function Content() {
  const [tab, setTab] = useState<Tab>("Favorite");

  return (
    <>
      <PageWrapper>
        <MyMusicPlaylistList />

        <SingerSection />

        <div>
          <Title title="Songs" />

          <div className="flex space-x-2 my-3">
            <Tab render={(t) => t} setTab={setTab} tab={tab} tabs={tabs} />
          </div>

          {tab === "Favorite" ? <FavoriteSongList /> : <UploadedSongList />}
        </div>
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

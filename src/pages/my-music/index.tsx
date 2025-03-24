import Footer from "@/layout/primary-layout/_components/Footer";
import { Title } from "@/components";
import { useState } from "react";
import FavoriteSongList from "./_components/FavoriteSong";
import UploadedSongList from "./_components/UploadedSong";
import MyMusicPlaylistList from "./_components/PlaylistList";
import Tab from "@/components/Tab";
import BackBtn from "@/components/BackBtn";
import MyMucisSingerList from "./_components/SingerList";

const tabs = ["Favorite", "Uploaded"] as const;
type TabType = (typeof tabs)[number];

export default function MyMusicPage() {
  const [tab, setTab] = useState<TabType>("Favorite");

  return (
    <>
      <div className="space-y-5">
        <BackBtn />

        <MyMusicPlaylistList />

        <MyMucisSingerList />

        <div>
          <Title title="Songs" />

          <div className="flex space-x-2 my-3">
            <Tab
              render={(t) => t}
              setTab={setTab}
              tab={tab}
              tabs={["Favorite", "Uploaded"]}
            />
          </div>

          {tab === "Favorite" ? <FavoriteSongList /> : <UploadedSongList />}
        </div>
      </div>
      <Footer />
    </>
  );
}

import Footer from "@/layout/primary-layout/_components/Footer";
import { Title } from "@/components";
import { useState } from "react";
import FavoriteSongList from "./_components/FavoriteSong";
import UploadedSongList from "./_components/UploadedSong";
import MyMusicPlaylistList from "./_components/PlaylistList";
import Tab from "@/components/Tab";

const tabs = ["Favorite", "Uploaded"] as const;
type TabType = (typeof tabs)[number];

export default function MyMusicPage() {
  const [tab, setTab] = useState<TabType>("Favorite");

  return (
    <>
      <MyMusicPlaylistList />
      <div className="pt-[30px]"></div>

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

      <Footer />
    </>
  );
}

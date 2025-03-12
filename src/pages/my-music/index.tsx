import { useThemeContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import { Button, Title } from "@/components";
import { useState } from "react";
import FavoriteSongList from "./_components/FavoriteSong";
import UploadedSongList from "./_components/UploadedSong";
import MyMusicPlaylistList from "./_components/PlaylistList";

export default function MyMusicPage() {
  // stores
  const { theme } = useThemeContext();

  const [tab, setTab] = useState<"favorite" | "uploaded">("favorite");

  const classes = {
    inActiveTab: `border border-${theme.alpha} bg-transparent`,
    activeTab: `${theme.content_bg}`,
  };

  return (
    <>
      <MyMusicPlaylistList />
      <div className="pt-[30px]"></div>

      <Title title="Songs" />

      <div className="flex space-x-2 my-3">
        <Button
          onClick={() => setTab("favorite")}
          className={`${tab === "favorite" ? classes.activeTab : classes.inActiveTab}`}
        >
          Favorite
        </Button>
        <Button
          onClick={() => setTab("uploaded")}
          className={`${tab === "uploaded" ? classes.activeTab : classes.inActiveTab}`}
        >
          Uploaded
        </Button>
      </div>

      {tab === "favorite" ? <FavoriteSongList /> : <UploadedSongList />}

      <Footer />
    </>
  );
}

import { useThemeContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import { Button, PlaylistList, Title } from "@/components";
import useMyMusic from "./_hooks/useMyMusic";
import { useState } from "react";
import FavoriteSongList from "./_components/FavoriteSong";
import UploadedSongList from "./_components/UploadedSong";

export default function MyMusicPage() {
  // stores
  const { theme } = useThemeContext();

  const { isFetching, playlists } = useMyMusic();

  const [tab, setTab] = useState<"favorite" | "uploaded">("favorite");

  const classes = {
    inActiveTab: `border border-${theme.alpha} bg-transparent`,
    activeTab: `${theme.content_bg}`,
  };

  return (
    <>
      <Title title="Playlists" />

      <PlaylistList loading={isFetching} playlists={playlists} />
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

      {/* <div className="flex items-center justify-between">
        <label
          className={`${theme.content_bg}  items-center hover:opacity-60 py-1 rounded-full flex px-4 cursor-pointer`}
          htmlFor="song_upload"
        >
          <ArrowUpTrayIcon className="w-7 mr-1" />
          <span className="font-playwriteCU leading-[2.2]">Upload</span>
        </label>
      </div> */}

      <Footer />
    </>
  );
}

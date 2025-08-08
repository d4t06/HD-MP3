import { PlaylistList, Tab, Title } from "@/components";
import useMyMusicPlaylist from "../_hooks/useGetMyMusicPlaylist";
import AddNewPlaylistBtn from "./AddNewPlaylistBtn";
import { useSongContext } from "@/stores";
import { setLocalStorage } from "@/utils/appHelpers";

export default function MyMusicPlaylistSection() {
  const { ownPlaylists, favoritePlaylists } = useSongContext();
  const { isFetching, setIsFetching, setTab, tab, tabs } = useMyMusicPlaylist();


  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <Title title="Playlist" />

          <AddNewPlaylistBtn />
        </div>

        <div className="flex space-x-2 my-3">
          <Tab
            render={(t) => t}
            setTab={(t) => {
              setIsFetching(true);
              setTab(t);
              setLocalStorage("last_playlist_tab", t);
            }}
            tab={tab}
            tabs={tabs}
          />
        </div>
        <PlaylistList
          loading={isFetching}
          skeNumber={4}
          playlists={tab === "Favorite" ? favoritePlaylists : ownPlaylists}
        />
      </div>
    </>
  );
}

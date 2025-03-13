import { PlaylistList, Title } from "@/components";
import Tab from "@/components/Tab";
import useGetHomePlaylist from "../_hooks/useGetHomePlaylist";

export default function HomePlaylist() {
  const { getPlaylist, isFetching, playlistMap, ...rest } = useGetHomePlaylist();

  return (
    <>
      <Title title="Playlist" />

      <div className="flex space-x-2 my-3">
        <Tab render={(t) => t} {...rest} />
      </div>

      <PlaylistList loading={isFetching} playlists={playlistMap[rest.tab].playlists} />
    </>
  );
}

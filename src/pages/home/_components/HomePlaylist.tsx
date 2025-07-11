import { PlaylistList, Title, Tab } from "@/components";
import useGetHomePlaylist from "../_hooks/useGetHomePlaylist";

export default function HomePlaylist() {
  const { getPlaylist, isFetching, playlistMap, ...rest } = useGetHomePlaylist();

  return (
    <>
      <div>
        <Title title="Playlist" />

        <div className="flex space-x-2 my-2">
          <Tab render={(t) => t} {...rest} />
        </div>

        <PlaylistList loading={isFetching} playlists={playlistMap[rest.tab].playlists} />
      </div>
    </>
  );
}

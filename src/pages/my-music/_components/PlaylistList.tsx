import { PlaylistList, Title } from "@/components";
import useMyMusicPlaylist from "../_hooks/useGetMyMusicPlaylist";
import AddNewPlaylistBtn from "./AddNewPlaylistBtn";
import { useEffect } from "react";

export default function MyMusicPlaylistList() {
  const { isFetching, playlists, getPlaylist } = useMyMusicPlaylist();

  useEffect(() => {
    getPlaylist();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <Title title="Playlist" />

          <AddNewPlaylistBtn />
        </div>
        <PlaylistList loading={isFetching} playlists={playlists} />
      </div>
    </>
  );
}

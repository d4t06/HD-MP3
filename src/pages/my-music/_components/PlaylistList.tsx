import { PlaylistList, Title } from "@/components";
import useMyMusicPlaylist from "../_hooks/useGetMyMusicPlaylist";
import AddNewPlaylistBtn from "./AddNewPlaylistBtn";
import { useEffect } from "react";
import { useSongContext } from "@/stores";

export default function MyMusicPlaylistList() {
  const { playlists } = useSongContext();
  const { isFetching, getPlaylist } = useMyMusicPlaylist();

  useEffect(() => {
    getPlaylist();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <Title title="Playlist" />

          <AddNewPlaylistBtn />
        </div>
        <PlaylistList loading={isFetching} playlists={playlists} />
      </div>
    </>
  );
}

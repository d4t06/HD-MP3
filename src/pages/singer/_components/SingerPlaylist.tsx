import { PlaylistList, Title } from "@/components";
import { useSingerContext } from "./SingerContext";

export default function SingerPlaylist() {
  const { isFetching, playlists } = useSingerContext();

  return (
    <>
      <div>
        <Title title="Popular Playlists" />
        <PlaylistList playlists={playlists} loading={isFetching} />
      </div>
    </>
  );
}

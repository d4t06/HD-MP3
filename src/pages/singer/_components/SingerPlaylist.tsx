import { PlaylistList, Title } from "@/components";
import { useSingerContext } from "./SingerContext";

export default function SingerPlaylist() {
  const { isFetching, playlists } = useSingerContext();

  return (
    <>
      <div>
        <Title variant={'h2'} title="Popular Playlists" />
        <PlaylistList playlists={playlists} loading={isFetching} />
      </div>
    </>
  );
}

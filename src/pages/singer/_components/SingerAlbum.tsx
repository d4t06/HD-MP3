import { PlaylistList, Title } from "@/components";
import { useSingerContext } from "./SingerContext";

export default function SingerAlbum() {
  const { albums, isFetching } = useSingerContext();

  return (
    <>
      <Title variant={'h2'} title="Albums" />
      <PlaylistList playlists={albums} loading={isFetching} />
    </>
  );
}

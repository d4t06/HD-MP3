import { PlaylistList, Title } from "@/components";
import { useSingerContext } from "./SingerContext";
import { getHidden } from "@/utils/appHelpers";

export default function SingerAlbum() {
  const { albums, isFetching } = useSingerContext();

  return (
    <div>
      <Title variant={"h2"} title="Albums" className={getHidden(!albums.length)} />
      <PlaylistList whenEmpty={<></>} playlists={albums} loading={isFetching} />
    </div>
  );
}

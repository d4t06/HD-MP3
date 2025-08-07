import { PlaylistList, Title } from "@/components";
import { useSingerContext } from "./SingerContext";
import { getHidden } from "@/utils/appHelpers";

export default function SingerPlaylist() {
  const { isFetching, playlists } = useSingerContext();

  return (
    <>
      <div>
        <Title variant={'h2'} title="Popular Playlists" className={getHidden(!playlists.length)}/>
        <PlaylistList whenEmpty={<></>} playlists={playlists} loading={isFetching} />
      </div>
    </>
  );
}

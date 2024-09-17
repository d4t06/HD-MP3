import { useSongsStore, useAuthStore, useTheme } from "../store";
import { useInitSong } from "../hooks";
import {PlaylistList, HomeSongList} from "../components";
import { MobileNav, MobileSetting } from "@/components";

export default function HomePage() {
  // store
  const { loading: userLoading } = useAuthStore();
  const { adminPlaylists } = useSongsStore();
  const { isOnMobile } = useTheme();

  // hooks
  const { loading: useSongLoading } = useInitSong({});

  return (
    <>
      {isOnMobile && <MobileNav />}
      <div className="pb-[30px]">
        <h3 className="text-xl leading-[2.2] font-playwriteCU mb-3">Popular</h3>

        <PlaylistList
          loading={useSongLoading || userLoading}
          playlist={adminPlaylists}
          location="home"
        />
      </div>
      <div className="pb-[30px]">
        <HomeSongList loading={useSongLoading} />
      </div>

      {isOnMobile && <MobileSetting />}
    </>
  );
}

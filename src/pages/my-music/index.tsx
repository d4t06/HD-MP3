import { useEffect } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useGetSongPlaylist from "@/hooks/useGetSongPlaylist";
import { useAuthContext, useThemeContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import { PlaylistList, Title } from "@/components";
import MyMusicSongList from "./_components/MyMusicSongList";

export default function MyMusicPage() {
  // stores
  const { theme } = useThemeContext();
  const { user } = useAuthContext();

  const { isFetching, getSongAndPlaylist, playlists } = useGetSongPlaylist();

  useEffect(() => {
    if (user) getSongAndPlaylist({ variant: "user", email: user.email });
  }, []);

  return (
    <>
      <Title title="Playlists" />

      <PlaylistList loading={isFetching} playlists={playlists} />
      <div className="pt-[30px]"></div>

      <div className="flex items-center justify-between">
        <Title title="Songs" />
        <label
          className={`${theme.content_bg}  items-center hover:opacity-60 py-1 rounded-full flex px-4 cursor-pointer`}
          htmlFor="song_upload"
        >
          <ArrowUpTrayIcon className="w-7 mr-1" />
          <span className="font-playwriteCU leading-[2.2]">Upload</span>
        </label>
      </div>

      <MyMusicSongList isLoading={isFetching} />

      <Footer />
    </>
  );
}

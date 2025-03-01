import { useEffect } from "react";
import PlaylistList from "../components/PlaylistList";
import MySongSongsList from "../components/MySongSongsList";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useGetSongPlaylist from "@/hooks/useGetSongPlaylist";
import Footer from "@/layout/_components/Footer";
import { useAuthContext, useThemeContext } from "@/stores";

export default function MySongsPage() {
  // stores
  const { theme } = useThemeContext();
  const { user } = useAuthContext();

  const { isFetching, getSongAndPlaylist } = useGetSongPlaylist();

  // route guard
  useEffect(() => {
    if (user) getSongAndPlaylist({ variant: "user", email: user.email });
  }, []);

  return (
    <>
      <h3 className="font-playwriteCU leading-[2.2] mb-3 text-xl">Playlist</h3>

      <PlaylistList loading={isFetching} variant="my-song" />
      <div className="pt-[30px]"></div>

      <div className="flex items-center justify-between">
        <h3 className="font-playwriteCU leading-[2.2] mb-3 text-xl">Songs</h3>
        <label
          className={`${theme.content_bg} ${
            status === "uploading" || isFetching ? "disable" : ""
          } items-center hover:opacity-60 py-1 rounded-full flex px-4 cursor-pointer`}
          htmlFor="song_upload"
        >
          <ArrowUpTrayIcon className="w-7 mr-1" />
          <span className=" font-playwriteCU leading-[2.2]">Upload</span>
        </label>
      </div>

      <MySongSongsList initialLoading={isFetching} />

      <Footer />
    </>
  );
}

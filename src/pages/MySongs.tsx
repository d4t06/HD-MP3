import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useAuthStore, useUpload } from "../store";
import { BackBtn } from "../components";
import { routes } from "../routes";
import PlaylistList from "../components/PlaylistList";
import MySongSongsList from "../components/MySongSongsList";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import useGetSongPlaylist from "@/hooks/useGetSongPlaylist";

export default function MySongsPage() {
  // store
  const { theme } = useTheme();
  const { loading: userLoading, user } = useAuthStore();
  //   const { currentSong } = useSelector();

  // use hooks
  const { status } = useUpload();
  const navigate = useNavigate();
  //   const { loading: initialLoading, errorMsg, initial } = useInitSong({});

  const { isFetching } = useGetSongPlaylist({ variant: "user" });

  // route guard
  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      navigate(routes.Home);
    }
  }, [userLoading]);

  return (
    <div className="pb-[80px]">
      <div className="mb-[30px]  md:hidden">
        <BackBtn variant="my-songs" />
      </div>
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
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme, useSongsStore, useAuthStore, useUpload } from "../store";
import { useInitSong } from "../hooks";
import { BackBtn } from "../components";
import { routes } from "../routes";
import PlaylistList from "../components/PlaylistList";
import { PlusIcon } from "@heroicons/react/20/solid";
import MySongSongsList from "../components/MySongSongsList";
import { selectCurrentSong } from "@/store/currentSongSlice";
import SongSelectProvider from "@/store/SongSelectContext";

export default function MySongsPage() {
  // store
  const { theme } = useTheme();
  const { loading: userLoading, user } = useAuthStore();
  const { currentSong } = useSelector(selectCurrentSong);
  const { userPlaylists } = useSongsStore();

  // use hooks
  const { status } = useUpload();
  const navigate = useNavigate();
  const { loading: initialLoading, errorMsg, initial } = useInitSong({});

  // route guard
  useEffect(() => {
    if (userLoading) return;
    if (!user) return;

    if (!user.email) {
      navigate(routes.Home);
      console.log(">>> navigate to home");
    }
  }, [userLoading, initial]);

  if (errorMsg) return <h1>{errorMsg}</h1>;

  return (
    <>
      <div className="pb-[30px] ">
        {window.innerWidth < 800 && <BackBtn to="" />}
        <h3 className="font-playwriteCU leading-[2.2] mb-3 text-xl">Playlist</h3>

        <PlaylistList
          activeCondition={!!currentSong.song_in}
          loading={initialLoading}
          playlist={userPlaylists}
          location="my-songs"
        />
      </div>

      <div className="pb-[30px]">
        <div className="flex items-center justify-between">
          <h3 className="font-playwriteCU leading-[2.2] mb-3 text-xl">Songs</h3>
          <label
            className={`${theme.content_bg} ${
              status === "uploading" || initialLoading
                ? "opacity-60 pointer-events-none"
                : ""
            } items-center hover:opacity-60 rounded-full flex px-3 cursor-pointer`}
            htmlFor="song_upload"
          >
            <PlusIcon className="w-6 mr-[5px]" />
            <span className=" font-playwriteCU leading-[2.2]">Upload</span>
          </label>
        </div>

        <SongSelectProvider>
          {errorMsg && <p>Some thing went wrong</p>}
          {!errorMsg && <MySongSongsList initialLoading={initialLoading} />}
        </SongSelectProvider>
      </div>
    </>
  );
}
